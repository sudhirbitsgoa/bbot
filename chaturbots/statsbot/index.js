const bot = require('bbot')
const scene = require('./scene')
const { paths, patterns } = require('./content')

scene.setup(bot)
bot.global.enter(paths.stats)
bot.global.text(patterns.stats, paths.stats)
bot.global.text(patterns.start, paths.start)

bot.global.text(/(hi|hello) bot get stats/, (b) => {
	bot.adapters.message.driver.asyncCall('getStatistics')
		.then(result => {
			b.reply(JSON.stringify(result));
		});
}, {
	id: 'hello-bots'
});
