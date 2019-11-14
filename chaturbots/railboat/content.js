'use strict';
const scene = require('./scene')
//const panchgamAPI = require('./sdk');
const railAPI = require('./sdk');
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

// Keep langPattern separated for cleaner conversation logic
const patterns = {
  english: {
    start: /\b(hi astro|hello astro|hey astro)\b$/i,
    pnr:/(?<!\d)((\d{10})|(\d{4}-\d{4})|(\d.\d{3}-\d.\d{3}))(?!\d)(\s+([AaDdPp])([1-9][0-9]*))?/g,
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
    this.langPattern = patterns.english;
    this.i18n = i18n;
    if (lang === 'english') {
      this.i18n = i18nEng;
    }
    await paths.pnrcheckOpts(b)
  },
  pnrcheckOpts: async (b) => {
    await b.respond(
      `Check the status of your train ticket with PNR ?`
    )
    path(b).reset()
    path(b).text(this.langPattern.pnr, paths.checkPnr)
    path(b).text(this.langPattern.exit, paths.exit)
    path(b).catchAll((b) => b.respond(
      `Sorry, that doesn't look like a valid pnr number.`
    ))
  },
  checkPnr: async (b) => {
    const pnrnumber = b.match[0];
    path(b).text(this.langPattern.exit, paths.exit);
    try {
      railAPI.call(pnrnumber, function(err, result) {
        b.envelope.write(result)
        b.respond({
             "color": "#cac4c4",
              "actions": [{
                  "type": "button",
                  "text": "Quit Right ?",
                  "msg": "quit",
                  "msg_in_chat_window": true
              }]
          })
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