'use strict';
const scene = require('./scene')
const panchgamAPI = require('./sdk');
const i18n_module = require('i18n-nodejs');
const i18n = new i18n_module('tg', './../../locale.json');
const i18nEng = new i18n_module('eng', './../../locale.json');

console.log(i18n.__('Welcome'));
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
        case 'Horoscope': return "astro_details";
        case 'Basic Panchange': return "basic_panchang";
        default: break;
      }
  }
}

// Keep langPattern separated for cleaner conversation logic
const patterns = {
  'తెలుగు': {
    start: /(నమస్కారం ఆస్ట్రో|హలో ఆస్ట్రో|హాయ్ ఆస్ట్రో|hi astro)$/i,
    panchangamOptions: /(జాతకం|సంఖ్యా శాస్త్రం|గుణమేళనం|బేసిక్ పంచంగ్)$/i,
    // ddmmyyyyhhmm: /\b(pattern)\b$/i,
    ddmmyyyy: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/i,
    hhmm: /([01]?[0-9]|2[0-3]):[0-5][0-9]$/i,
    skip: /దాటు$/i,
     start: /(ప్రారంభం|కొత్త|ముగింపు)$/i,
    exit: /(విడువు|నిష్క్రమించు|రద్దుచేయు)$/i,
  },
  english: {
    start: /\b(hi astro|hello astro|hey astro)\b$/i,
    panchangamOptions: /\b(horoscope|numerology|Match making|Basic Panchange)\b$/i,
    // ddmmyyyyhhmm: /\b(pattern)\b$/i,
    ddmmyyyy: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/i,
    hhmm: /([01]?[0-9]|2[0-3]):[0-5][0-9]$/i,
    skip: /skip$/i,
    start: /(start|new|begin)$/i,
    exit: /\b(quit|exit|cancel)\b$/i,
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
    if (lang === 'english') {
      this.i18n = i18nEng;
    }
    await b.respond(this.i18n.__('Welcome'))
    await paths.panchangOpts(b)
  },
  panchangOpts: async (b) => {
   b.envelope.payload.custom({ 
     "channel": "#general", "attachments": [{
      "title": "Choose Options",
      "button_alignment": "horizontal",
      "actions": [
      {
        "type": "button",
        "text": `${this.i18n.__('horoscope')}`,
        "msg": `${this.i18n.__('horoscope')}`,
        "msg_in_chat_window": true
      },
      {
        "type": "button",
        "text": `${this.i18n.__('basicPanchang')}`,
        "msg": `${this.i18n.__('basicPanchang')}`,
        "msg_in_chat_window": true
      },
      {
        "type": "button",
        "text": `${this.i18n.__('numerology')}`,
        "msg": `${this.i18n.__('numerology')}`,
        "msg_in_chat_window": true
      },
      {
        "type": "button",
        "text": `${this.i18n.__('matchMaking')}`,
        "msg": `${this.i18n.__('matchMaking')}`,
        "msg_in_chat_window": true
      }
      ]
      }]
  }) 
  await b.respond().catch((err) => console.error(err))
    // await b.respond(
    //   `\`${this.i18n.__('horoscope')}\` \`${this.i18n.__('numerology')}\` \`${this.i18n.__('matchMaking')}\` \`${this.i18n.__('basicPanchang')}\``
    // )
    path(b).reset()
    path(b).text(this.langPattern.panchangamOptions, paths.panchangamOffers)
    path(b).text(this.langPattern.exit, paths.exit)
    path(b).catchAll((b) => {
      b.respond(`${this.i18n.__('sorryIdontknowoption')}. ${this.i18n.__('quitortryagain')}`)
    })

  },
  panchangamOffers: async (b) => {
    const self = this;
    const matched = b.match[0];
    collection['selectedoption'] = matched;
    await b.respond(
      `${this.i18n.__('panchangamOffersEntry', {matched: matched})}`);
    path(b).reset()
    // const statics = await bot.adapters.message.driver.asyncCall('getStatistics');
    switch (matched) {
      case this.i18n.__('horoscope'):
        await b.respond(self.i18n.__('getDateofBirth'));
        path(b).text(self.langPattern.ddmmyyyy, paths.getTime);
        break;
      case 'Numerology':
        // resp = statics.onlineUsers;      
        break;
      case 'Match Making':
        // resp = statics.offlineUsers;      
        break;
      case this.i18n.__('basicPanchang'):
           await b.respond(self.i18n.__('getDateofBirth'));
           path(b).text(self.langPattern.ddmmyyyy, paths.getTime);
           break;   
      default:
        // resp = statics;
        break;
    }
    // await b.respond(JSON.stringify(resp));
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
      b.respond(`${this.i18n.__('sorryIdontknowoption')}. ${this.i18n.__('quitortryagain')}`)
    });
  },
  getTime: async (b) => {
    await b.respond(
      `${this.i18n.__('getTimeofBirth')}`);
    // await b.respond(
    //   `మీరు పుట్టిన సమయం \`hh:mm\``
    // );
    path(b).reset();
    path(b).text(this.langPattern.hhmm, paths.horoscopeCall);
    path(b).text(this.langPattern.exit, paths.exit);
    path(b).catchAll((b) => b.respond(
      `Sorry not an option now.`
    ));
  },
  horoscopeCall: async (b) => {
    const params = getUserParamInfo(b);
    const resource = getResourceInfo(b);
    const matched = b.match[0];
    const time = params.ddmmyyyy;
    let dob = time.split('.');
    let hhmm = matched.split(':');
    path(b).text(this.langPattern.exit, paths.exit);
    path(b).text(this.langPattern.panchangamOptions, paths.panchangamOffers)
    try {
      panchgamAPI.call(resource, dob[0], dob[1], dob[2], hhmm[0], hhmm[1], 17.387140, 78.491684, 5.5, function(err, result) {
        b.respond(result);
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