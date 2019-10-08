const bot = require('bbot')
const scene = require('./scene')


// bot.global.enter(paths.start)
bot.global.text(/(panchangam|dailyhoroscope|horoscope|numerology|Match making|Basic Panchange)$/, function(b) {
    const { paths } = require('./content')();
    const message = b.message.toString();
    scene.setup(bot);
    const splitMsg = message.split(' ');
    paths.langOption(b,splitMsg[1]);
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality