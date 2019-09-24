const bot = require('bbot')
const scene = require('./scene')


// bot.global.enter(paths.start)
bot.global.text(/(panchangam)$/, function(b) {
    scene.setup(bot);
    const { paths } = require('./content')();
    paths.langOption(b);
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality