const bot = require('bbot')
const request = bot.request;

/** Add your bot logic here. Removing the imported examples. */
require('./examples')

bot.start()

console.log('the bot started');

setTimeout(() => {
    console.log('bot', bot);
}, 3000);