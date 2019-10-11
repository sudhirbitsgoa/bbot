const bot = require('bbot')
const scene = require('./scene')
const data = require('./data')
//const { paths, patterns } = require('./content')


// bot.global.enter(paths.start)
bot.global.text(/(panchangam|dailyhoroscope|horoscope|Numerology|Matchmaking|Basicpanchange)$/, function(b) {
    const message = b.message.toString();
    const splitMsg = message.split(' ');
    scene.setup(bot);
    const { paths } = require('./content')(splitMsg[1]);
    data(b.message.user.id).setPanchnageOption(splitMsg[1])
    paths.langOption(b)
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality