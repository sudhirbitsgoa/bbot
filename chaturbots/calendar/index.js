const bot = require('bbot')
const scene = require('./scene')
const data = require('./data')
//const { paths, patterns } = require('./content')


scene.setup(bot);
const path = (b) => scene.path(b.message.user.id)

bot.global.text(/(hi|hey|hello)$/i, function(b) {
   b.envelope.payload.custom({ 
     "attachments": [{
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

bot.global.text(/quit$/i, (b) => {
	scene.exit(b);
});

// first ask user to select language
// then list bots available in the language
// then dive in to functionality