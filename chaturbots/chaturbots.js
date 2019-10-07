const bot = require('bbot')
require('./statsbot');
require('./panchangam');
require('./railboat');
bot.global.text(/hi|hello|hey/i, function(b) {
	b.envelope.write('Welcome to chatur - your intelligent assistant.I can help you in some ways.')
	b.envelope.payload.custom({ 
     "channel": "#general", "attachments": [{
      "button_alignment": "horizontal",
      "actions": [
          {
            "type": "button",
            "text": 'stats',
            "msg": 'stats',
            "msg_in_chat_window": true
          },
          {
            "type": "button",
            "text": 'pnr',
            "msg": 'pnr',
            "msg_in_chat_window": true
          },
          {
            "type": "button",
            "text": "Daily Horoscope",
            "msg": "dailyhoroscope",
            "msg_in_chat_window": true
          },
          {
            "type": "button",
            "text": "horoscope",
            "msg": "horoscope",
            "msg_in_chat_window": true
          },
          {
            "type": "button",
            "text": "Basic Panchange",
            "msg": "Basic Panchange",
            "msg_in_chat_window": true
          },
          {
            "type": "button",
            "text": "Numerology",
            "msg": "Numerology",
            "msg_in_chat_window": true
          },
          {
            "type": "button",
            "text": "Match Making",
            "msg": "Match Making",
            "msg_in_chat_window": true
          }
       ]
      }]
  }) 
  b.respond().catch((err) => console.error(err))
    //b.respond("Please select among these bots `stats` `panchangam`, `pnr`");
})
// require('./account_setup');