const bot = require('bbot')
const scene = require('./scene')
//const { paths, patterns } = require('./content')
const Axios = require('axios')
const download = require('./download');
const uploadFile = require('./uploadFile');

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
	});
	await b.respond().catch((err) => console.error(err));
	path(b).reset()
	path(b).text(/(.*)$/i, async function (b) {
		const message = b.message.toString();
		if (b.message.text) {
			if (/quit$/i.test(message)) {
				await b.reply('Say Hi when ready!');
				scene.exit(b.message.user.id);
				return;
			}
			return await b.reply('No valid image');
		}
		try {
			const image = b.message.payload.attachments[0].image_url;
			const image_url = `${process.env.ROCKETCHAT_URL}${image}`;
			const token = await bot.adapters.message.driver.login({
				username: process.env.ROCKETCHAT_USER,
				password: process.env.ROCKETCHAT_PASSWORD
			});
			const userId = b.user.id;
			console.log('the file %j', token);
			try {
				const dir = Date.now().toString();
				await download(image_url, userId, dir);
				await triggerSolver(image);
				await uploadFile(userId, b.user.room.id, dir);
			} catch (error) {
				console.log('the image url', error);				
			}
		} catch (error) {
			debugger;
		}
		// console.log(message); // get the file link in here
	});
});

async function triggerSolver(file) {
	const res = await Axios({
		method: 'GET',
		url: `http://localhost:5000/solve?inputfile=${file}`
	});
	return res;
}