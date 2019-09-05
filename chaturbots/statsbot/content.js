const scene = require('./scene')
const credentials = require('./credentials')
const admin = require('./admin')
const bot = require('bbot')

// Shortcut to path handlers for user ID
const path = (b) => scene.path(b.message.user.id)

// Keep patterns separated for cleaner conversation logic
const patterns = {
  stats: /\b(hi|hello|hey)\b$/i,
  email: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  frameworks: /\b(totalUsers|onlineUsers|offlineUsers|totalChannelMessages|totalPrivateGroupMessages|none)\b$/i,
  username: /(\w*)$/i,
  password: /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  set: /set$/i,
  skip: /skip$/i,
  confirm: /confirm$/i,
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
      `Hi I'm Chatur Stats, Please select what stats are needed`
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
      "Do you need `totalUsers`, `onlineUsers`, `offlineUsers`, `totalChannelMessages`, `totalPrivateGroupMessages`, or `none`?"
    )
    path(b).reset()
    path(b).text(patterns.frameworks, paths.framework)
    path(b).text(patterns.exit, paths.exit)
    path(b).catchAll((b) => {
      b.respond(
        `Sorry, I don't know how to get stats for ${b.match}.`,
        `Please try again, or reply \`quit\` if you want to try later.`)
    })
  },
  exit: async (b) => {
    await b.respond(
      `No problem, just say \`hi\` when you want to try again. :wave:`
    )
    scene.exit(b.message.user.id)
  }
}

module.exports = { patterns, paths }
