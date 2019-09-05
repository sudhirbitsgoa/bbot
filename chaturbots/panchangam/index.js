const bot = require('bbot')
const scene = require('./scene')


// bot.global.enter(paths.start)
bot.global.text(/(తెలుగు|english)$/, function(b) {
    const message = b.message.toString();
    const splitMsg = message.split(' ');
    scene.setup(bot);
    const { paths, patterns } = require('./content')(splitMsg[1]);
    paths.start(b, splitMsg[1], patterns);
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality