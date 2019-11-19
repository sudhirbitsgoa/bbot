const bot = require('bbot')

bot.global.text(/(hi|hello) bot get stats/, (b) => {
	bot.adapters.message.driver.asyncCall('getStatistics')
		.then(result => {
			b.reply(JSON.stringify(result));
		});
}, {
	id: 'hello-bots'
})