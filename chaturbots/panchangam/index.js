const bot = require('bbot')
const scene = require('./scene')


// bot.global.enter(paths.start)
bot.global.text(/(panchangam|dailyhoroscope)$/, function(b) {
    scene.setup(bot);
    const { paths } = require('./content')();
    const message = b.message.toString();
    const splitMsg = message.split(' ');
    paths.langOption(b,splitMsg[1]);
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality