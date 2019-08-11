const scene = require('./scene')
const credentials = require('./credentials')
const panchgamAPI = require('./sdk');

// Shortcut to path handlers for user ID
const path = (b) => scene.path(b.message.user.id)

const collection = {};
function getUserParamInfo(b) {
  if (!collection[b.message.user.id]) {
    collection[b.message.user.id] = {};
  }
  return collection[b.message.user.id];
}

// Keep patterns separated for cleaner conversation logic
const patterns = {
  stats: /\b(hi astro|hello astro|hey astro)\b$/i,
  panchangamOptions: /\b(Horoscope|Numerology|Match Making|none)\b$/i,
  // ddmmyyyyhhmm: /\b(pattern)\b$/i,
  ddmmyyyy: /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/i,
  hhmm: /([01]?[0-9]|2[0-3]):[0-5][0-9]$/i,
  skip: /skip$/i,
  start: /(start|new|begin)$/i,
  exit: /\b(quit|exit|cancel)\b$/i,
}

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
  stats: async (b) => {
    await b.respond(
      `Hi I'm Chatur Panchangam, Please select among...`
    )
    await paths.statsOption(b)
  },
  start: async (b) => {
    await b.respond(
      `To start, I need your email so I can setup your user credentials.`
    )
    path(b).reset()
    path(b).text(patterns.email, paths.email)
    path(b).text(patterns.exit, paths.exit)
    path(b).catchAll((b) => b.respond(
      `Sorry, that doesn't look like a valid email address.`,
      `Please try again, or reply \`quit\` if you want to try later.`
    ))
  },
  statsOption: async (b) => {
    await b.respond(
      "`Horoscope`, `Numerology`, `Match Making`, or `none`?"
    )
    path(b).reset()
    path(b).text(patterns.panchangamOptions, paths.panchangamOffers)
    path(b).text(patterns.exit, paths.exit)
    path(b).catchAll((b) => {
      b.respond(
        `Sorry, I don't know how to get panchangam for ${b.match}.`,
        `Please try again, or reply \`quit\` if you want to try later.`)
    })

  },
  panchangamOffers: async (b) => {
    // const framework = b.match[0]
    const offers = 'Horoscope'
    b.bot.logger.info(`[faldo] storing offers information  ${offers}`)
    // credentials(b.message.user.id).setFramework(framework)
    const matched = b.match[0]
    await b.respond(
      `Alright, it seems you want ${matched} :slight_smile:.`)
    path(b).reset()
    // const statics = await bot.adapters.message.driver.asyncCall('getStatistics');
    switch (matched) {
      case 'Horoscope':
        await b.respond(
          `Please enter your birth date in this format \`dd.mm.yyyy\``
        );
        path(b).text(patterns.ddmmyyyy, paths.getTime);
        break;
      case 'horoscope':
        await b.respond(
          `Please enter your birth date in this format \`dd.mm.yyyy\``
        );
        path(b).text(patterns.ddmmyyyy, paths.getTime);
        break;
      case 'Numerology':
        // resp = statics.onlineUsers;      
        break;
      case 'Match Making':
        // resp = statics.offlineUsers;      
        break;
      default:
        // resp = statics;
        break;
    }
    // await b.respond(JSON.stringify(resp));
    path(b).text(patterns.panchangamOptions, paths.panchangamOffers)
    path(b).text(patterns.exit, paths.exit)
    path(b).catchAll((b) => {
      const message = b.message.message.toString();
      const actulaMsg = message.split(' ')[1];
      var reg = new RegExp(patterns.ddmmyyyy);
      var resp = reg.test(actulaMsg);
      if (resp) {
        const params = getUserParamInfo(b);
        params.ddmmyyyy = actulaMsg;
        paths.getTime(b);
        return
      }
      debugger;
      b.respond(
        `Sorry that's not an option right now.`,
        `Reply with either \`Horoscope\`, \`Numerology\`, \`Match Making\``
      );
    });
  },
  getTime: async (b) => {
    await b.respond(
      `Enter birth time as \`hh:mm\``
    );
    path(b).reset();
    path(b).text(patterns.hhmm, paths.horoscopeCall);
    path(b).text(patterns.exit, paths.exit);
    path(b).catchAll((b) => b.respond(
      `Sorry not an option now.`
    ));
  },
  horoscopeCall: async (b) => {
    const params = getUserParamInfo(b);
    const matched = b.match[0];
    const time = params.ddmmyyyy;
    debugger;
    let dob = time.split('.');
    let hhmm = matched.split(':');
    path(b).text(patterns.exit, paths.exit);
    try {
      panchgamAPI.call('astro_details', dob[0], dob[1], dob[2], hhmm[0], hhmm[1], 17.387140, 78.491684, 5.5, function(err, result) {
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

module.exports = { patterns, paths }
