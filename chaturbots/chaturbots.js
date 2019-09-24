const bot = require('bbot')
require('./statsbot');
require('./panchangam');
require('./railboat');
bot.global.text(/hi|hello|hey/i, function(b) {
    b.respond("Please select among these bots `stats` `panchangam`, `pnr`");
})
// require('./account_setup');