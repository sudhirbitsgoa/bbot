'use strict';
const scene = require('./scene')
const data = require('./data');
const panchgamAPI = require('./sdk');
const i18n_module = require('i18n-nodejs');
const i18n = new i18n_module('tg', './../../locale.json');
const i18nEng = new i18n_module('eng', './../../locale.json');

// Shortcut to path handlers for user ID
const path = (b) => scene.path(b.message.user.id)

const collection = {};

function getUserParamInfo(b) {
  if (!collection[b.message.user.id]) {
    collection[b.message.user.id] = {};
  }
  return collection[b.message.user.id];
}

function getResourceInfo(b) {
  if(collection.selectedoption){
     const matched = collection.selectedoption;
      switch(matched){
        case 'horoscope': return "astro_details";
        case 'Basicpanchange': return "basic_panchang";
        default: break;
      }
  }
}

function formatResponse(result) {
	let response = result;
	let respTxt = '';
	try {
		response = JSON.parse(result);
	} catch (error) {
		console.log(error);
	}
	// b.envelope.write(response);
	for (const key in response) {
		if (response.hasOwnProperty(key)) {
			const element = response[key];
			if (typeof element === 'string') {
				let splitKeys = key.split('_');
				let parsedKey = '';
				for (let i = 0; i < splitKeys.length; i++) {
					let e = splitKeys[i];
					if (i === 0) {
						e = e[0].toUpperCase() + e.slice(1);
					}
					parsedKey+=`${e} `;
				}
				respTxt += `${parsedKey}: `;
				respTxt += `${element} \n \n`;
			} else {
				respTxt += formatResponse(element);
			}
		}
	}
	return respTxt;
}

// Keep langPattern separated for cleaner conversation logic
const patterns = {
  'తెలుగు': {
    start: /(నమస్కారం ఆస్ట్రో|హలో ఆస్ట్రో|హాయ్ ఆస్ట్రో|hi astro)$/i,
    panchangamOptions: /(జాతకం|సంఖ్యా శాస్త్రం|గుణమేళనం|బేసిక్ పంచంగ్)$/i,
    ddmmyyyy: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/i,
    hhmm: /([01]?[0-9]|2[0-3]):[0-5][0-9]$/i,
    skip: /దాటు$/i,
     start: /(ప్రారంభం|కొత్త|ముగింపు)$/i,
    exit: /(విడిచి|విడువు|నిష్క్రమించు|రద్దుచేయు)$/i,
  },
  english: {
    start: /\b(hi astro|hello astro|hey astro)\b$/i,
    panchangamOptions:/\b(panchangam|dailyhoroscope|horoscope|Numerology|Matchmaking|Basicpanchange)\b$/i,
    dailyhoroscopeOptions: /\b(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)\b$/i,
    ddmmyyyy: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/i,
    hhmm: /([01]?[0-9]|2[0-3]):[0-5][0-9]$/i,
    skip: /skip$/i,
    start: /(start|new|begin)$/i,
    exit: /\b(quit|exit|cancel)\b$/i,
    strddmmyyyy: /(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})/,
    persioname: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g,
  }
};

/**
 * Path callbacks object keeps listener handling DRY and allows routing multiple
 * interactions toward shared handlers, or even circular for catching errors.
 * Paths that add additional path/s (via `scene.path`) adds the user to
 * an array of 'engaged' users, so their responses will be evaluated against
 * only those additional paths, not the global listeners.
 * To return the user to the global listener scope, use `scene.exit()`
 * @todo Enable mongo adapter, store credentials and resume / re-create after
 *       server reset - changing branches on welcome for known user.
 */
const paths = {
  start: async (b, lang, pattern) => {
    this.lang = lang;
    this.langPattern = pattern;
    this.i18n = i18n;
    const params = getUserParamInfo(b);
    if (lang === 'english') {
      this.i18n = i18nEng;
      params.language = 'en';
    }else{
      params.language = 'te';
    }
    await b.respond(this.i18n.__('Welcome'))
    path(b).reset()
    await paths.getPanchangDetails(b);
  },
  getPanchangDetails: async (b) => {
    const self = this;
    const optionvalue = data(b.message.user.id).getData()
    const matched = optionvalue.panchangoption;
    collection['selectedoption'] = matched;
    switch (matched) {
      case this.i18n.__('basicPanchang'):
             path(b).reset()
             paths.getDate(b); 
           break;   
      default:
        // resp = statics;
        break;
    }
    path(b).reset()
    path(b).text(this.langPattern.panchangamOptions, paths.panchangamOffers)
    path(b).text(this.langPattern.exit, paths.exit)
    path(b).catchAll((b) => {
      const message = b.message.message.toString();
      const actulaMsg = message.split(' ')[1];
      var reg = new RegExp(this.langPattern.ddmmyyyy);
      var resp = reg.test(actulaMsg);
      if (resp) {
        const params = getUserParamInfo(b);
        params.ddmmyyyy = actulaMsg;
        paths.getTime(b);
        return
      }
      paths.quitandtryagain(b);
    });
  },
  quitandtryagain: async (b) => {
      b.envelope.payload.custom({ 
       "channel": "#general", "attachments": [{
        "actions": [
        {
          "type": "button",
          "text": `${this.i18n.__('sorryIdontknowoption')}. ${this.i18n.__('quitortryagain')}`,
          "msg": `${this.i18n.__('quit')}`,
          "msg_in_chat_window": true
        }
        ]
      }]
      })
     await b.respond().catch((err) => console.error(err))
  },
  getDate: async(b) => {
      const self = this;
      await b.respond(self.i18n.__('getDate'));
      path(b).reset()
      path(b).text(this.langPattern.exit, paths.exit)
      path(b).text(this.langPattern.panchangamOptions, paths.panchangamOffers)
      path(b).catchAll((b) => {
        const message = b.message.message.toString();
        const actulaMsg = message.split(' ')[1];
        var reg = new RegExp(this.langPattern.ddmmyyyy);
        var resp = reg.test(actulaMsg);
        if (resp) {
          const params = getUserParamInfo(b);
          params.dateddmmyyyy = actulaMsg;
          paths.getBasicPanchangDetail(b);
          return
        }
        paths.quitandtryagain(b);
      });
  },
  panchangamOffers: async (b) => {
    const self = this;
    const matched = b.match[0];
    collection['selectedoption'] = matched;
    switch (matched) {
      case this.i18n.__('basicPanchang'):
             path(b).reset()
             paths.getDate(b); 
             break;  
      default:
        // resp = statics;
        break;
    }
    path(b).reset()
    path(b).text(this.langPattern.panchangamOptions, paths.panchangamOffers)
    path(b).text(this.langPattern.exit, paths.exit)
    path(b).catchAll((b) => {
      const message = b.message.message.toString();
      const actulaMsg = message.split(' ')[1];
      var reg = new RegExp(this.langPattern.ddmmyyyy);
      var resp = reg.test(actulaMsg);
      if (resp) {
        const params = getUserParamInfo(b);
        params.ddmmyyyy = actulaMsg;
        paths.getTime(b);
        return
      }
      paths.quitandtryagain(b);
    });
  },
  
  getTime: async (b) => {
    await b.respond(
      `${this.i18n.__('getTimeofBirth')}`);
    path(b).reset();
    path(b).text(this.langPattern.hhmm, paths.horoscopeCall);
    path(b).text(this.langPattern.exit, paths.exit);
    path(b).catchAll((b) => b.respond(
      `Sorry not an option now.`
    ));
  },
	getBasicPanchangDetail: async (b) => {
		const self = this;
		const params = getUserParamInfo(b);
		let date = params.dateddmmyyyy;
		let tdate = date.split('.');
		let language = params.language;
		path(b).text(this.langPattern.exit, paths.exit);
		path(b).text(this.langPattern.panchangamOptions, paths.panchangamOffers)
		try {
			panchgamAPI.basicPanchangCall('basic_panchang/sunrise', tdate[0], tdate[1], tdate[2], 17.387140, 78.491684, 5.5, language, function (err, result) {
				b.envelope.write(formatResponse(result));
				let msg = 'quit';
				if (self.i18n._lang === 'tg') {
					msg = 'నిష్క్రమించు';
				}
				b.respond({
					"color": "#cac4c4",
					"actions": [{
						"type": "button",
						"text": `${self.i18n.__('quitRight')}`,
						"msg": `${msg}`,
						"msg_in_chat_window": true
					}]
				});
			});
		} catch (error) {
			console.log('erro', error);
		}
	},
  finish: async (b) => {
    await b.respond(`Amazing, I'll just get that ...`)
    collection[b.message.user.id] = null;
    scene.exit(b.message.user.id)
  },
  exit: async (b) => {
    collection[b.message.user.id] = null;
    data(b.message.user.id).resetData()
    await b.respond(
      `No problem, just say \`hi\` when you want to try again. :wave:`
    )
    scene.exit(b.message.user.id)
  }
}

module.exports = function(opt) {
  return {
    patterns: patterns[opt], paths: paths
  };
}


