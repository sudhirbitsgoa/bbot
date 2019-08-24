const bot = require('bbot')
const scene = require('./scene')
const { paths, patternsTel } = require('./content')

scene.setup(bot)
// bot.global.enter(paths.start)
bot.global.text(patternsTel.start, paths.start)

