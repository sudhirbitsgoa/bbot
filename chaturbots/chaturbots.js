const bot = require('bbot')
// require('./utilities');
require('./calendar');
// require('./calendar');
// bot.global.text(/hi|hello|hey/i, function(b) {
//   b.envelope.write('Welcome to chatur - your intelligent assistant.I can help you in some ways.')
//   b.envelope.payload.custom({ 
//      "channel": "#general", "attachments": [{
//       "button_alignment": "vertical",
//       "actions": [
//            {
//             "type": "button",
//             "text": "CALENDAR",
//             "msg": "calender",
//             "msg_in_chat_window": true
//            },
//            {
//             "type": "button",
//             "text": "UTILITIES",
//             "msg": "utilities",
//             "msg_in_chat_window": true
//            },
//            {
//             "type": "button",
//             "text": "PERSONAL",
//             "msg": "personal",
//             "msg_in_chat_window": true
//            }
//        ]
//       }]
//   }) 
//   b.respond().catch((err) => console.error(err))
// })
// bot.global.text(/utilities$/, function(b) {
//   b.envelope.write('Welcome to chatur - your intelligent assistant.I can help you in some ways.')
//   b.envelope.payload.custom({ 
//      "channel": "#general", "attachments": [{
//       "button_alignment": "horizontal",
//       "actions": [
//            {
//             "type": "button",
//             "text": "Check PNR status",
//             "msg": "pnr",
//             "msg_in_chat_window": true
//            },
//            {
//             "type": "button",
//             "text": "Check Chatur System Status",
//             "msg": "stats",
//             "msg_in_chat_window": true
//            }
//        ]
//       }]
//   }) 
//   b.respond().catch((err) => console.error(err))
// })