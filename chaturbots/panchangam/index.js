const bot = require('bbot')
const scene = require('./scene')
const data = require('./data')
//const { paths, patterns } = require('./content')


scene.setup(bot);
const path = (b) => scene.path(b.message.user.id)
// bot.global.enter(paths.start)
bot.global.text(/personal$/, function(b) {
   b.envelope.payload.custom({ 
     "channel": "#general", "attachments": [{
      "button_alignment": "horizontal",
      "actions": [
          {
              "type": "button",
              "text": 'Daily Nakshatra (English)',
              "msg": 'dailyhoroscope english',
              "msg_in_chat_window": true
          },
          {
              "type": "button",
              "text": 'Daily Nakshatra (Telugu)',
              "msg": 'dailyhoroscope తెలుగు',
              "msg_in_chat_window": true
          },
          {
              "type": "button",
              "text": 'Numerology',
              "msg": 'Numerology english',
              "msg_in_chat_window": true
          },
          {
              "type": "button",
              "text": 'MatchMaking',
              "msg": 'Matchmaking english',
              "msg_in_chat_window": true
          }
      ]
      }]
    }) 
    b.respond().catch((err) => console.error(err))
    path(b).reset()
    path(b).text(/(dailyhoroscope english|dailyhoroscope తెలుగు|Numerology english|Matchmaking english)$/i, function(b) {
       const message = b.message.toString();
       const splitMsg = message.split(' ');
       const { paths } = require('./content')(splitMsg[1]);
       const { patterns } = require('./content')(splitMsg[2]);
       data(b.message.user.id).setPanchnageOption(splitMsg[1])
       paths.start(b,splitMsg[2],patterns);
    });
})

bot.global.text(/calender$/, function(b) {
   b.envelope.payload.custom({ 
     "channel": "#general", "attachments": [{
      "button_alignment": "horizontal",
      "actions": [
          {
              "type": "button",
              "text": 'Calendar (English)',
              "msg": 'Basicpanchange english',
              "msg_in_chat_window": true
          },
          {
              "type": "button",
              "text": 'Calendar (Telugu)',
              "msg": 'బేసిక్ తెలుగు',
              "msg_in_chat_window": true
          }
      ]
      }]
    }) 
    b.respond().catch((err) => console.error(err))
    path(b).reset()
    path(b).text(/(Basicpanchange english|బేసిక్ తెలుగు)$/i, function(b) {
       const message = b.message.toString();
       const splitMsg = message.split(' ');
       const { paths } = require('./content')(splitMsg[1]);
       const { patterns } = require('./content')(splitMsg[2]);
       data(b.message.user.id).setPanchnageOption(splitMsg[1])
       paths.start(b,splitMsg[2],patterns);
    });
})

bot.global.text(/quit$/, (b) => {
	scene.exit(b);
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality