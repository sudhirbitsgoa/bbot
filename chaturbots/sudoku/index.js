const bot = require('bbot')
const scene = require('./scene')
//const { paths, patterns } = require('./content')


scene.setup(bot);
const path = (b) => scene.path(b.message.user.id)
// bot.global.enter(paths.start)
bot.global.text(/(hi|hey|hello)$/i, async function (b) {
	b.envelope.write('Upload sudoku image... 🎁 ')
	b.envelope.payload.custom({
		// "text": "Upload sudoku image...",
		"attachments": [{
			"button_alignment": "horizontal",
			"actions": [
				{
					"type": "button",
					"text": 'Quit',
					"msg": 'quit',
					"msg_in_chat_window": true
				}
			]
		}]
	})
	await b.respond().catch((err) => console.error(err));
	path(b).reset()
	path(b).text(/(.*)$/i, async function (b) {
		const message = b.message.toString();
		if (!b.message.attachments) {
			if (/quit$/i.test(message)) {
				await b.reply('Say Hi when ready!');
				scene.exit(b.message.user.id);
				return;
			}
			await b.reply('No valid image');
		}
		console.log(message); // get the file link in here
	});
});