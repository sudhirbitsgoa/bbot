const bot = require('bbot')
require('./statsbot');
require('./panchangam');
require('./railboat');
bot.global.text(/hi|hello|hey/i, function(b) {
	b.envelope.write('Welcome to chatur - your intelligent assistant.I can help you in some ways.')
	b.envelope.payload.custom({ 
     "channel": "#general", "attachments": [{
      "button_alignment": "vertical",
      "actions": [
           {
            "type": "button",
            "text": "Check the status of your train ticket with PNR ?",
            "msg": "pnr",
            "msg_in_chat_window": true
           },
           {
            "type": "button",
            "text": "Basic Panchange  information (English or Telugu)",
            "msg": "Basicpanchange",
            "msg_in_chat_window": true
           },
           {
            "type": "button",
            "text": "Horoscope chart information (English or Telugu)",
            "msg": "horoscope",
            "msg_in_chat_window": true
           },
           {
            "type": "button",
            "text": "Daily Horoscope (English or Telugu)",
            "msg": "dailyhoroscope",
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
            "msg": "Matchmaking",
            "msg_in_chat_window": true
           },
           {
            "type": "button",
            "text": 'ChaturAI statistics (for system information)',
            "msg": 'stats',
            "msg_in_chat_window": true
           },
           {
            "type": "button",
            "text": "Help",
            "msg":"hi",
            "msg_in_chat_window": true
           }
       ]
      }]
  }) 
  b.respond().catch((err) => console.error(err))
})