const bot = require('bbot')
const scene = require('./scene')


// bot.global.enter(paths.start)
bot.global.text(/(PNR)/i, function(b) {
    const message = b.message.toString();
     const splitMsg = message.split(' ');
     scene.setup(bot);
     const { paths } = require('./content')(splitMsg[1]);
     paths.start(b);
});