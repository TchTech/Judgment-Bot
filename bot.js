const Discord = require("discord.js");
const client = new Discord.Client({
// ws: { intents: "GUILD_MEMBERS" },
});
const configfile = require("./data/config.json");
//const prefix = configfile.prefix;
const token = configfile.token;
const commands = require("./commands.json");
const help_messages = require("./helps.json");
const conflicts = {};
var is_allowed_to_census = true;
var mongoose = require("mongoose");
var user_model = require("./user_model");
const mongo_uri = configfile.mongo_uri
var conflict_model = require("./conflict_model");
const moment = require("moment");
const channel_model = require("./channel_model");
var added_users_ids = [];
var added_channels_ids = [];
const getAddedUsers = require("./src/getAddedUsers").getAddedUsers
const { exec } = require('child_process');
const getAddedChannels = require("./src/getAddedChannels").getAddedChannels;
// const { exception } = require("console");
var message_amount = {}
var previous_messages = {}
const bot_logo = "https://cdn.discordapp.com/avatars/799723410572836874/51e3f97734ef1259f4587e7eba719cf1.png?size=128"


// const output = execSync('node kingbot.js', { encoding: 'utf-8' });
// async()=>{
exec("node kingbot.js")
// }
// console.log('The output is:');
// console.log(output);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// keeps the server alive
// const http = require('http');
// const express = require('express');
// const app = express();
// app.get("/", (request, response) => {
//   console.log(Date.now() + " Ping Received");
//   response.sendStatus(200);
// });
// app.listen(3000);
// setInterval(async () => {
//   await http.get(`https://discord-bot-kappa.vercel.app/`);
// }, 140000);

// MAIN TODO: SEASONS AND THEN DB USERS ADD; SAVE ALL ADDED IDS IN ARRAY IN READY; MAKE FEWER USER PRINT IN RATING;

// const command_client = new Client(
//   token,
//   "799723410572836874"
// );

// command_client
//   .createCommand({
//     name: "b!repeat",
//     description: "repeats the message",
//   })
//   .then(console.log)
//   .catch(console.error);

/*TODO: DISCORD BUTTONS ON CONFLICTS
TODO:   RATING FIX
TODO:   BOTTER.PY;
        B!OPTION;
        HELP FIX;
        ========
        FALLS REFORMATION;
        ==========
        FASTER RATING;
        ONLY ONE DB CONNECT;
        CHANNEL ADDING LINKE USRS; +
        LOGS;
        TRY-CATCH; +
        +SITE;
        +SEASONS;
        +GAME-ROLES;
        LANGUAGE MODES;
        README.MD;
        +TYPING;
        TESTS;
	MAKE MESSAGE DELETER ON SPAM;
  SLASH COMMANDS;
        */

client.on("ready", () => {
  console.log("I am ready!");
  console.log(Discord.version);
  client.user.setActivity(
    "Type b!enghelp for English help (Пропишите b!ruhelp для помощи на Русском)",
    {
      type: "STREAMING",
      url: "https://www.twitch.tv/discord"

    }
  );
  getAddedUsers().then((users)=>{added_users_ids = users;});
  getAddedChannels().then((channels)=>{added_channels_ids = channels})
});

client.on("guildMemberAdd", (member) => {
  if (member.guild.id == "804772492978946089") {
    let role = member.guild.roles.cache.find(
      (role) => role.id == "847184804377526332"
    );
    member.roles.add(role);
    member.send(
      "***Хе-хе-хе...***\nТы сделал хороший выбор, друг! Наслаждайся анонсами бота, обращайся в поддержку и следи за новостями IT и GAME индустрии.\nВ общем, рай на земле, не так ли?"
    );
  }
});

client.on("message", (message) => {
  if (
    message.channel.type === "dm" &&
    message.author.id != '799723410572836874'
  ) {
    message.reply(
      "Упсс... На данный момент вы не можете общаться со мной лично... Для этого есть сервера! https://cutt.ly/Fm70IQt"
    );
  } else {
    // if (message.content.split(" ")[0] === commands.cregistration) {
    //   channelRegistration(message);
    // }
    if (
      !message.author.bot &&
      client.guilds.cache.get(message.guild.id).member(message.author.id)
    ) {
        if(!added_channels_ids.includes(message.guild.id)){
          channelRegistration(message).then(()=>{
            added_channels_ids.push(message.guild.id)
          })
        }
        checkUserInDB(message).catch((err)=>{
          message.channel.send("ERROR: couldn't make check or save of " + message.author.username + " in DB...")
          console.log(err)
        });
        giveScores(message).catch((err)=>{
          message.channel.send("ERROR: unable give score to " + message.author.username)
          console.log(err)
        });
        antiSpamDefender(message)
    } else if(message.author.id !== '799723410572836874'){
      message.react("🚫")
    }
    switch (message.content.split(" ")[0]) {
      case commands.score:
        checkScore(message).catch((err)=>{
          message.channel.send("ERROR: unable to check score of " + message.author.username)
          console.log(err)
        })
        break;
      case commands.rating:
        mongoose.set("useFindAndModify", true);
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useUnifiedTopology", true);
        mongoose.connect(mongo_uri, (err) => {
          if (err) throw err;
          mongoose.connection.db.collection("channels", (err) => {
            if (err) throw err;
            channel_model.findOne(
              { ds_id: message.guild.id },
              (err, channel) => {
                console.log(err, channel);
                if (err) throw err;
              try{
                asyncRating(channel, message);
              } catch(err){
                message.channel.send("ERROR: unable to send rating.")
                console.log(err)
              }
              }
            );
          });
        });
        break;
      // case commands.uregistration:
      //   message.channel.startTyping()
      //   userRegistration(message).then(()=>{
      //     message.channel.stopTyping()
      //   });
      //   break;
      // case "b!supertest":
      //   updateGuilds()
      //   break;
      case commands.birthday:
        message.channel.startTyping()
        sendBirthday(message).then(()=>{
          message.channel.stopTyping()
        });
        break;
      // case commands.introducing:
      // giveFall(message)
      // checkFall(message).then((falls)=>{
      //   message.reply(falls);
      //   })
      //   break;
      case commands.conflict:
        message.channel.startTyping()
        if (message.mentions.members.first() === undefined) {
          message.reply(
            "Error: вы не указали пользователя, которого хотите осудить.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
          );
        } else if (message.content.split(" ")[3] === undefined) {
          message.reply(
            "Error: вы не указали причину вашего обращения.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
          );
        } else if (
          message.content.split(" ")[2] !== "fall" &&
          message.content.split(" ")[2] !== "ban" &&
          message.content.split(" ")[2] !== "kick"
        ) {
          message.reply(
            "Error: вы указали неверное значение наказания (или не указали его вовсе). Корректные значения: `fall`, `kick`, `ban`.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
          );
        } else if (
          message.mentions.members.first().user.id === "799723410572836874"
        ) {
          message.reply(
            "Error: Ты серьёзно? Ты пошел жаловаться на суд в суд..? Не-а, так не получится.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
          );
        } else if (message.author.id === message.mentions.members.first().id) {
          message.reply(
            "Error: извините, но вы не можете жаловаться на самого себя.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
          );
        } else {
          //CHECK IN DB
          let conflict_id = new mongoose.Types.ObjectId();
          let lawbreaker = message.mentions.members.first();
          let authors_id = message.author.id;
          console.log(authors_id);
          //createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
          try{
          mongoose.set("useFindAndModify", true);
          mongoose.set("useNewUrlParser", true);
          mongoose.set("useUnifiedTopology", true);
          mongoose.connect(mongo_uri, (err) => {
            if (err) throw err;
            mongoose.connection.db.collection("users", (err) => {
              if (err) throw err;
              user_model.findOne({ ds_id: authors_id }, (err, user) => {
                if (err) throw err;
                if (user === null) {
                  createUser(
                    message.author.username,
                    message.author.id,
                    0,
                    [message.guild.id],
                    message.author.avatarURL()
                  );
                  message.reply(
                    "Уупс... Вы не были занесены в базу даных... Но мы сами (автоматически) добавили вас в базу!\n(*Продолжаем оформление конфликта...*)"
                  );
                }
              });
              user_model.findOne({ ds_id: lawbreaker.user.id }, (err, user) => {
                if (err) throw err;
                if (user === null) {
                  createUser(
                    lawbreaker.user.username,
                    lawbreaker.user.id,
                    0,
                    [message.guild.id],
                    lawbreaker.user.avatarURL()
                  );
                  message.reply(
                    "Уупс... Преступник не был занесён в базу даных... Но мы сами (автоматически) добавили его(её) в базу!\n(*Продолжаем оформление конфликта...*)"
                  );
                }
              });
              conflicts[message.mentions.members.first()] = {
                reporter: message.author.username,
                reason: message.content.split(" ").slice(3).join(" "),
                punishment: message.content.split(" ").slice(2, 3).join(" "),
              };
              message.channel.stopTyping()
              message.channel
                .send(
                  "Предстать @everyone перед судом! На данный момент " +
                    conflicts[message.mentions.members.first()].reporter +
                    " устроил конфликт с " +
                    lawbreaker.user.username +
                    " из-за того, что " +
                    conflicts[message.mentions.members.first()].reason +
                    ".\nПредложенное решение: " +
                    conflicts[message.mentions.members.first()].punishment +
                    ".\n`ID конфликта: " +
                    conflict_id.toHexString() +
                    "`"
                )
                .then((m) => {
                  m.react("👍");
                  m.react("👎");
                  try {
                    setTimeout(
                      /*43200000*/ conflictConfirmation,
                      7200,
                      m,
                      conflict_id._id.toHexString(),
                      conflicts[message.mentions.members.first()].punishment
                    );
                  } catch (e) {
                    console.log(e);
                  }
                });
          });
            createConflict(conflict_id, message);
          });
        }catch(err){
        message.channel.send("ERROR: something went wrong in conflict process.")
        console.log(err)}
      }
      break;
      case commands.census:
        message.channel.startTyping()
        try{
        if (is_allowed_to_census === false) {
          message.reply(
            "Sorry, please, you should wait for a while, because censuses are created too often."
          );
          message.channel.stopTyping()
        } else {
          //message.reply('Предстать @everyone перед судом! На данный момент ' + conflicts[message.mentions.members.first()].reporter + ' устроил конфликт с ' + lawbreaker.user.username + ' из-за того, что ' + conflicts[message.mentions.members.first()].reason + '.\nПредложенное решение: ' + conflicts[message.mentions.members.first()].punishment + '.')
          let comment = message.content.split(" ").slice(1).join(" ");
          let is_empty = false;
          if (comment === "") is_empty = true;
          is_empty
            ? message.channel
                .send(
                  "Внимание, @everyone , была предложена перепись мнения (ну или сенсус). Настоятельно предлагаем поучавствовать в голосовании-опросе:\n *Довольны ли вы устройством сервера?*"
                )
                .then((m) => {
                  m.react("👍");
                  m.react("👎");
                })
            : message.channel
                .send(
                  'Внимание, @everyone , была предложена перепись мнения (ну или сенсус). Настоятельно предлагаем поучавствовать в голосовании-опросе:\n *"' +
                    comment +
                    '"*'
                )
                .then((m) => {
                  m.react("👍");
                  m.react("👎");
                });
          is_allowed_to_census = false;
          message.channel.stopTyping()
          setTimeout(censusPermission, 900000);
        }}catch(err){
          message.channel.send("ERROR: something went wrong in census process.")
        }
        break;
      case commands.ru_help:
        message.channel.startTyping()
        const helpEmbed = new Discord.MessageEmbed()
          .setColor("#a6550c")
          .setTitle("***Help page***")
          .setThumbnail(message.author.avatarURL())
          .setDescription("Последнее сообщение (07.05.2021)")
          .addFields(
            {
              name: "`b!enghelp`",
              value: "тоже самое что и `b!ruhelp`, но на английском языке!",
            },
            { name: "`b!repeat <message>`", value: "Повторение `message`." },
            {
              name: "`b!conflict <linked-users-name> <punishment {fall, kick, ban}> <case>`",
              value:
                "Краеугольная функция нашего бота. Она позволяет сделать конфликт (пожаловаться) на преступника. Решение выносится через 2 часа. Опробуйте её!",
              inline: true,
            },
            {
              name: "`b!census <question>`",
              value:
                "Удобная функция, которая позволяет сделать опрос вида *ЗА/ПРОТИВ*. Если `question` не указан, будет опрос об удобстве сервера. Можно сделать лишь раз в 15 мин.",
              inline: true,
            },
            {
              name: "`b!score`",
              value:
                "Позволяет узнать свои баллы и уровень на сервере.",
              inline: true,
            },
            {
              name: "`b!rating`",
              value:
                "Позволяет узнать баллы лучших мемберов.",
              inline: true,
            },
            {
              name: "`b!birthday <linked-user>`",
              value:
                "Если вы использовали эту комманду, бот поздравит `<linked-user>` с днем рождения!.",
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter(
            "Judgment-bot by TchTech",
            bot_logo
          );
          message.channel.stopTyping()
        message.channel.send(helpEmbed);
        break;
      case commands.repeat:
        message.channel.startTyping()
        let textCommand = message.content.split(" ");
        textCommand.splice(0, 1);
        message.reply(
          message.author.username + " said: " + textCommand.join(" ")
        );
        console.log(
          message.author.username + " said: " + textCommand.join(" ")
        );
        message.channel.stopTyping()
        break;
      case commands.en_help:
        message.reply(help_messages["eng-help-msg"]);
        break;
    }
  }
});

// var season = cron.schedule('0 0 30 * *', () => {
//   updateGuilds();
// })

// season.start()

const reducer = (accumulator, currentValue) => accumulator + currentValue;

async function updateGuilds() {
  console.log("update-guilds")
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, (err) => {
    if (err) throw err;
    mongoose.connection.db.collection("channels", (err) => {
      if(err) throw err
      channel_model.find({}).then((users) => {
        client.guilds.fetch('804772492978946089').then((guild)=>{
        let main_channel = guild.channels.cache.get('846821447585234964')
        main_channel.send('***Йо-хо-хо!***\n**@everyone Это же конец сезона! Время представить вам итоги сезона!**\n\n***ИМЕЙТЕ ВВИДУ, ЧТО ВСЕ ВАШИ БАЛЛЫ БУДУТ СБРОШЕНЫ, НО ИСХОДЯ ИЗ ВСЕХ БАЛЛОВ СЕРВЕРА БУДЕТ ВЫСЧИТАН УРОВЕНЬ СЕРВЕРА ПО ЭТОЙ СХЕМЕ:\n\n1 lvl: до 625 общих баллов;\n2 lvl: 625-799 баллов;\n3 lvl: 800-999 баллов;\n4 lvl: 1000-1199 баллов;\n5 lvl: 1200-1499 баллов;\n6 lvl: 1500-1899 баллов;\n7 lvl: 1900-2399 баллов;\n8 lvl: 2400-2999 баллов;\n9 lvl: 3000-5000 баллов;\n10:crown: lvl: более 5000 баллов.***\n\n***УДАЧИ ВАМ В СЛЕДУЩЕМ СЕЗОНЕ!***')
        users.forEach((channel, index, array) => {
          //SPLIT DISCT TO TWO ARRS AND SUM OF SECOND ARR IS ALL SCORE
            client.guilds.fetch(channel.ds_id, false).then((ds_channel) => {
              let sub_channel = channel
              channel.remove()
              console.log(channel.scores)
              createChannel(ds_channel.name, ds_channel.id, ds_channel.iconURL(), countSeasonLevel(scoresSum(sub_channel)));
              main_channel.send("`" + ds_channel.name + ": " + countSeasonLevel(scoresSum(sub_channel)) + ' lvl`')
        })
          });
        });
      });
    });
  });
}

function scoresSum(channel) {
  if(channel.scores === "{}") return 0 
  else return Object.values(JSON.parse(channel.scores)).reduce(reducer);
}

function countSeasonLevel(score){
  if(score < 625) return 1;
  else if(score >= 625 && score < 800) return 2;
  else if(score >= 800 && score < 1000) return 3;
  else if(score >= 1000 && score < 1200) return 4;
  else if(score >= 1200 && score < 1500) return 5;
  else if(score >= 1500 && score < 1900) return 6;
  else if(score >= 1900 && score < 2400) return 7;
  else if(score >= 2400 && score < 3000) return 8;
  else if(score >= 3000 && score < 5000) return 9;
  else if(score >= 5000) return 10;
}

async function sendBirthday(message) {
  if (message.mentions.members.first() !== undefined) {
    message.channel
      .send(
        "Внимание, @everyone ! Сегодня день рождения у пользователя `" +
        message.mentions.members.first().user.username +
        "` ! Поздравляем его с этим замечательным днём и желаем всего исключительно наилучшего!\n***УРА!!***"
      )
      .then((msg) => sleep(5000).then(
        msg.reactions.cache
          .get("484535447171760141")
          .then((msg) => msg.react("🎆"))
      )
      );
  } else {
    message.channel.send("Упс... Вы некорректно использовали команду...");
  }
}

async function userRegistration(message) {
  mongoose.connect(mongo_uri, (err) => {
    if (err)
      throw err;
    mongoose.connection.db.collection("users", (err) => {
      if (err)
        throw err;
      user_model.findOne({ ds_id: message.author.id }, (err, user) => {
        if (err)
          throw err;
        if (user == undefined) {
          createUser(
            message.author.username,
            message.author.id,
            0,
            [0],
            [message.guild.id],
            message.author.avatarURL()
          );
          message.reply(
            "You was included to database successfully! Now you have ability for conflicts! Hooray!🎆\n*Вы были успешно добавлены в базу данных! Отныне у вас есть возможность конфликтовать! Урра!🎆*"
          );
        } else {
          message.reply(
            "Oops... You was already included to database. You've already got conflict ability.\n*Упс... Вы уже были добавлены в базу данных. Вы уже получили возможность конфликтовать.*"
          );
        }
      });
    });
  });
}

async function checkScore(message) {
  let day = moment().date();
  if (day >= 19) {
    message.author.bot;
    message.channel.send(
      "***WARNING! VERY SOON OUR BOT WILL TURN OFF!***"
    );
  }
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  await mongoose.connect(mongo_uri, (err) => {
    if (err)
      throw err;
    mongoose.connection.db.collection("channels", (err) => {
      if (err)
        throw err;
      let authors_id = message.author.id.toString();
      channel_model.findOne(
        { ds_id: message.guild.id },
        (err, channel) => {
          if (err)
            throw err;
          let obj = JSON.parse(
            JSON.parse(JSON.stringify(channel.scores))
          );
          message.reply(
            "Твоя настоящая стата: *`" +
            obj[authors_id] +
            " баллов; " +
            getLevel(obj[authors_id]) +
            " lvl.`*"
          );
        }
      );
    });
  });
}

async function channelRegistration(message) {
  mongoose.connect(mongo_uri, (err) => {
    if (err)
      throw err;
    mongoose.connection.db.collection("channels", (err) => {
      if (err)
        throw err;
      channel_model.findOne({ ds_id: message.guild.id }, (err, channel) => {
        if (err)
          throw err;
        if (channel == undefined) {
          createChannel(
            message.guild.name,
            message.guild.id,
            message.guild.iconURL()
          );
          message.reply(
            "Channel was included to database successfully! Now you have many abilities like score-getting! Hooray!🎆\n*Канал был успешно добавлен в базу данных! Отныне у вас есть возможности вроде получения баллов! Урра!🎆*"
          );
        } else {
          message.reply(
            "Oops... You was already included to database.\n*Упс... Вы уже были добавлены в базу данных.*"
          );
        }
      });
    });
  });
}

async function giveScores(message) {
  mongoose.set("useFindAndModify", true);
      mongoose.set("useNewUrlParser", true);
      mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, (err) => {
    if (err) throw err;
  mongoose.connection.db.collection("channels", (err) => {
    if (err)
      throw err;
    let authors_id = message.author.id.toString();
    channel_model.findOne({ ds_id: message.guild.id }, (err, channel) => {
      console.log(err, channel);
      if (err)
        throw err;
      console.log("SSGG");
      let obj = JSON.parse(channel.scores);
      let day = moment().date();
      let score;
      if (day == 1 || day == 10 || day == 20 || day == 30) {
        score = (obj[authors_id] || 0) + 6 + randomNumber(0, 4);
        message.react("🎈");
      } else {
        score = (obj[authors_id] || 0) + 2 + randomNumber(0, 4);
      }
      obj[authors_id] = score;
      channel.scores = JSON.stringify(obj);
      channel.save();
    });
  })
  });
}

async function giveFall(message){
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, (err) => {
  if (err) throw err;
  mongoose.connection.db.collection("channels", (err) => {
    if (err)
    throw err;
    let authors_id = message.author.id.toString();
    channel_model.findOne({ ds_id: message.guild.id }, (err, channel) => {
        if (err) throw err
        let obj = JSON.parse(channel.falls);
        obj[authors_id] = (obj[authors_id] || 0) + 1;
        channel.falls = JSON.stringify(obj);
        channel.save().then(()=>{
          message.reply("FG")
        })
    })
  })
})
}

async function checkFall(message){
  return new Promise(resolve => {
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, (err) => {
  if (err) throw err;
  mongoose.connection.db.collection("channels", (err) => {
    if (err)
    throw err;
    let authors_id = message.author.id.toString();
    channel_model.findOne({ ds_id: message.guild.id }, (err, channel) => {
        if (err) throw err
        let obj = JSON.parse(channel.falls);
        resolve((obj[authors_id] || 0))
    })
  })
})
})
}

// FUNCTIONS --------------------------------------------------------------------

async function checkUserInDB(message) {
  if (!added_users_ids.includes(message.author.id)) {
    createUser(message.author.username, message.author.id, 0, [], message.author.avatarURL());
    added_users_ids.push(message.author.id);
  }
}

// function getAddedUsers() {
//   let added_users_ids = []
//   mongoose.connect(mongo_uri, (err) => {
//     if (err)
//       throw err;
//     mongoose.connection.db.collection("users", (err) => {
//       if (err)
//         throw err;
//       user_model.find({}, (err, users) => {
//         if (err)
//           throw err;
//         users.forEach((user, index, array) => {
//           added_users_ids.push(user.ds_id);
//           if(index + 1 === array.length){
//             return added_users_ids
//           }
//         });
//       });
//     });
//   });
// }

function sendRatingEmbed(users, message) {
  if (users === {}) {
    message.channel.send(
      "*Упс... ни одного пользователя с баллами не найдено...*\nХе-хе-хе..."
    );
  } else {
    let ratingEmbed = new Discord.MessageEmbed()
      .setColor("#f78649")
      .setTitle("***Рейтинг!***")
      .setThumbnail(client.user.avatarURL())
      .addFields(users)
      .setTimestamp()
      .setFooter(
        "Judgment-bot by TchTech",
        bot_logo
      );
    message.channel.send(ratingEmbed);
  }
}

var clearMsg
var warnings_amount = {}

async function antiSpamDefender(message){
  if(!message.author.bot 
//&& !message.member.hasPermission("ADMINISTRATOR")
){
  const memberPath = message.guild.id + ":" + message.author.id;
  console.log(message.mentions)
  let hasPreviousRepeat = previousRepeatDetector(message.content, memberPath)
  let hasWordsRepeat = wordsRepeatDetector(message.content)
  let isGreaterThanLimit = greaterThanLimit(message.content)
  let hasPings = extendsPings(message)
  let hasLetterRepeat = letterRepeatDetector(message.content)
  console.log(message.content.length)
  message_amount[memberPath] = (message_amount[memberPath] || 0) + 1 + hasPreviousRepeat + hasWordsRepeat + isGreaterThanLimit + hasPings + hasLetterRepeat
  console.log("amount:" + message_amount[memberPath])
  if(clearMsg !==undefined) clearTimeout(clearMsg)
  clearMsg = setTimeout(clearMessageAmount, 1100, message)
  if(message_amount[memberPath] >= 5){
    message.reply("You should stop!")
    warnings_amount[memberPath] = (warnings_amount[memberPath] || 0) + 1
    if(warnings_amount[memberPath] == 2){
      
    }
  }
}
}

function letterRepeatDetector(content){
  let differences = 0;
  content.split(" ").forEach((string)=>{
    differences += string.length - string.split('').filter(function(item, pos, self) {return self.indexOf(item) == pos;}).join("").length;
  })
  if(differences>12) return 1
  else return 0
}

async function clearPreviousMessage(memberPath){
  delete previous_messages[memberPath]
}

function greaterThanLimit(content){
  const limit = 50;
  if(content.length >= limit) return 1
  else return 0
}

function extendsPings(message){
  if(message.mentions.members != null || message.mentions.everyone === true|| message.mentions.roles != null|| message.mentions.users != null) return 1
  else return 0
}

var previousMessageCleaner;

function previousRepeatDetector(content, memberPath){
  if(previousMessageCleaner !== undefined) clearTimeout(previousMessageCleaner)
  if(content == previous_messages[memberPath]){
    previous_messages[memberPath] = content
    previousMessageCleaner = setTimeout(clearPreviousMessage, 7000, memberPath)
    return 1
  }else{
    previous_messages[memberPath] = content
    previousMessageCleaner = setTimeout(clearPreviousMessage, 7000, memberPath)
    return 0
  }
}

function wordsRepeatDetector(content){
  let words = content.split(" ")
  let word_count = {}
  words.forEach((word)=>{
    word_count[word] = (word_count[word] || 0) + 1
  })
  let multiplier = 1
  Object.values(word_count).forEach((value)=>{
    multiplier *= value
  })
  const limit = 15
  if(multiplier >= limit) return 1 
  else return 0
}

async function clearMessageAmount(message){
  delete message_amount[message.guild.id + ":" + message.author.id]
  if(warnings_amount[message.guild.id + ":" + message.author.id] !== undefined){
    delete warnings_amount[message.guild.id + ":" + message.author.id]
  }
}

function compareSecondColumn(a, b) {
  if (b[1] === a[1]) {
      return 0;
  }
  else {
      return (b[1] < a[1]) ? -1 : 1;
  }
}

function asyncRating(channel, message) {
  let users = [];
  let obj = JSON.parse(JSON.parse(JSON.stringify(channel.scores)));
  //if(Object.keys(obj).includes(authors_id) === false){console.log("no user", Object.keys(obj))//channel.scores.set(authors_id) = Math.random() + 9obj[authors_id] += Math.random() + 9;Object.assign(obj, {[authors_id]: 0})obj[authors_id] += 9 + randomNumber(0, 4)}else{console.log("all ok", Object.values(obj))//channel.scores.set(authors_id) = channel.scores.get(authors_id) + Math.random() + 9}
  //client.users.cache.find(user => user.id === key) message.guild.members.cache.get(key).user.username
  let sortable = [];
  for (let user in obj) {
    sortable.push([user, obj[user]]);
  }

  sortable = sortable.sort((a,b)=>compareSecondColumn(a, b));
  console.log(sortable);
  console.log(client.users.cache)
  let top_place = 1;
  sortable.forEach((element, index) => {
    console.log(element[0])
    if (element[0] != '799723410572836874') {
      message.guild.members.fetch(element[0], true).then((member) => {
        console.log(index)
        users.push({
          name: top_place + "." + member.user.username + ":",
          value: (obj[element[0]] || 0) + " Баллов;",
        });
        top_place++;
        if (index + 1 == sortable.length) {
          sendRatingEmbed(users, message);
        }
      });
    }
  });
}

function getLevel(score) {
  let result = 0;
  let i = score;
  let lvllim = 100;
  while (i != 0) {
    if (i > lvllim) {
      result++;
      lvllim += 45;
    } else {
      return result;
    }
  }
}

function conflictConfirmation(msg, conflict_id_str, punishment) {
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, (err) => {
    if (err) throw err;
    mongoose.connection.db.collection("conflicts", (err) => {
      if (err) throw err;

      try {
        const reactions = msg.reactions.cache;
        let positive_votes = reactions.get("👍");
        let negative_votes = reactions.get("👎");

        if (positive_votes.count > negative_votes.count) {
          switch (punishment) {
            case "fall":
              fallProcess(positive_votes, negative_votes, msg);
              break;
            case "kick":
              kickProcess(positive_votes, negative_votes);
              break;
            case "ban":
              banProcess(positive_votes, negative_votes);
              break;
          }
        } else if (positive_votes.count < negative_votes.count) {
          stopProcessLess(positive_votes, negative_votes);
        } else if (positive_votes.count === negative_votes.count) {
          stopProcessEqual(positive_votes, negative_votes);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  function stopProcessEqual(positive_votes, negative_votes) {
    conflict_model.findByIdAndUpdate(
      conflict_id_str,
      {
        support_votes: positive_votes.count,
        decline_votes: negative_votes.count,
        is_confirmed: "NO",
      },
      (err, conflict) => {
        if (err) throw err;
        msg.channel.send(
          "@everyone Внимание! По конфликту №`" +
            conflict_id_str +
            "` НЕ было вынесено решения, так как оказалось положительных и отрицательных голосов оказалось по-ровну!"
        );
      }
    );
  }

  function stopProcessLess(positive_votes, negative_votes) {
    conflict_model.findByIdAndUpdate(
      conflict_id_str,
      {
        support_votes: positive_votes.count,
        decline_votes: negative_votes.count,
        is_confirmed: "NO",
      },
      (err, conflict) => {
        if (err) throw err;
        msg.channel.send(
          "@everyone Внимание! По конфликту №`" +
            conflict_id_str +
            "` НЕ было вынесено решения, так как оказалось больше отрицательных, чем положительных голосов!"
        );
      }
    );
  }

class Process{

}
  function fallProcess(positive_votes, negative_votes, message) {
    conflict_model.findByIdAndUpdate(
      conflict_id_str,
      {
        support_votes: positive_votes.count,
        decline_votes: negative_votes.count,
        is_confirmed: "YES",
      },
      (err, conflict) => {
        if (err) throw err;
        mongoose.connection.db.collection("channels", (err) => {
          //console.log(conflict.lawbreaker.toString());
          channel_model.findOne(
            { ds_id: conflict.guild.toString() },
            (err, channel) => {
              if (err) throw err;
              console.log(channel);
              let falls = JSON.parse(channel.falls)
              falls[conflict.lawbreaker] = (falls[conflict.lawbreaker] || 0) + 1
              channel.falls = JSON.stringify(falls)
              let user_lawbreaker = message.mentions.members.first().user
              guild.channels.cache.get(conflict.channel).send(
              "@everyone Внимание! По конфликту №`" +
              conflict_id_str +
                  "` было вынесено решение в пользу пожаловавшегося!\nРешение: `fall` для `" +
                  user_lawbreaker.username +
                  "`;\n На данный момент у `" +
                  user_lawbreaker.username +
                  "` `" +
                  falls[channel.lawbreaker] +
                  "` фолл(а);"
              );
                  if (falls[conflict.lawbreaker] >= 3) {
                    if (user_lawbreaker.kickable === false) {
                      guild.channels.cache.get(conflict.channel).send(
                        "ERROR: USER ISN'T KICKABLE. HIS FALLS: `" +
                          falls[conflict.lawbreaker] +
                          "`\nномер конфликта: `" +
                          conflict_id_str +
                          "`"
                      );
                    } else {
                      falls[conflict.lawbreaker] = 0
                      msg.channel.send(
                        "Пользователь `" +
                          user_lawbreaker.username +
                          "` Набрал МАКСИМУМ фоллов(в связи с последним конфликтом номер `" +
                          conflict_id_str +
                          "`), а значит суд изгоняет его из сервера! GOODBYE!"
                      );
                      user_lawbreaker.kick();
                    }
                  }
                  channel.save()
                })
              
            }
          );
      }
    );
  }

  function kickProcess(positive_votes, negative_votes) {
    conflict_model.findByIdAndUpdate(
      conflict_id_str,
      {
        support_votes: positive_votes.count,
        decline_votes: negative_votes.count,
        is_confirmed: "YES",
      },
      (err, conflict) => {
        if (err) throw err;
        let user_lawbreaker = msg.guild.members.cache.get(
          conflict.lawbreaker.toString()
        );
        if (user_lawbreaker.kickable === false) {
          msg.channel.send(
            "ERROR: USER ISN'T KICKABLE\nномер конфликта: `" +
              conflict_id_str +
              "`"
          );
        } else {
          msg.channel.send(
            "@everyone Внимание! По конфликту №`" +
              conflict_id_str +
              "` было вынесено решение в пользу пожаловавшегося!\nРешение: `kick` для `" +
              user_lawbreaker.user.username +
              "`"
          );
          user_lawbreaker.kick();
        }
      }
    );
  }

  function banProcess(positive_votes, negative_votes) {
    conflict_model.findByIdAndUpdate(
      conflict_id_str,
      {
        support_votes: positive_votes.count,
        decline_votes: negative_votes.count,
        is_confirmed: "YES",
      },
      (err, conflict) => {
        if (err) throw err;
        let user_lawbreaker = msg.guild.members.cache.get(
          conflict.lawbreaker.toString()
        );
        msg.channel.send(
          "@everyone Внимание! По конфликту №`" +
            conflict_id_str +
            "` было вынесено решение в пользу пожаловавшегося!\nРешение: `ban` для `" +
            user_lawbreaker.user.username +
            "`\n*(start process...)*"
        );
        try {
          user_lawbreaker.ban();
          msg.channel.send(
            "Процесс бана по конфликту номер `" +
              conflict_id_str +
              "` прошел успешно."
          );
        } catch {
          msg.channel.send(
            "ERROR: USER COULD NOT BE BANNED.\nномер конфликта: `" +
              conflict_id_str +
              "`"
          );
        }
      }
    );
  }
}

function createConflict(conflict_id, message) {
  mongoose.connection.db.collection("conflicts", (err) => {
    if (err) throw err;
    let newConflict = new conflict_model({
      _id: conflict_id,
      case: conflicts[message.mentions.members.first()].reason,
      reporter: message.author.id,
      lawbreaker: message.mentions.members.first(),
      punishment: conflicts[message.mentions.members.first()].punishment,
      guild: message.guild.id,
      channel: message.channel.id,
      support_votes: 1,
      decline_votes: 1,
      judgment_date: moment().add(12, "hours").toDate(),
      is_confirmed: "IN_WORK",
    });
    newConflict.save((err) => {
      if (err) throw err;
    });
  });
}

function randomNumber(min, max) {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
}
// client.channels.cache.forEach((channel) => {
//   console.log(channel);
// });
function fallsPermission() {
  is_allowed_to_fall = true;
}

function censusPermission() {
  is_allowed_to_census = true;
}

function createUser(
  name,
  id,
  falls,
  conflicts,
  profile_pic_link
) {
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, function (err, client) {
    if (err) throw err;
    console.log("Successfully connected");
    mongoose.connection.db.collection("users", function (err, collection) {
      if (err) throw err;
      console.log("Successfully connected to collection");
      var newUser = new user_model({
        _id: new mongoose.Types.ObjectId(),
        nickname: name,
        ds_id: id,
        falls: falls,
        conficts_member: conflicts,
        profile_picture: profile_pic_link,
      });

      newUser.save(function (err) {
        if (err) throw err;

        console.log("User successfully saved.");
        //mongoose.connection.close();
      });
    });
  });
}

async function createChannel(title, id, channel_pic, last_season) {
  last_season = last_season || 0
  mongoose.set("useFindAndModify", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(mongo_uri, function (err, client) {
    if (err) throw err;
    console.log("Successfully connected");
    mongoose.connection.db.collection("channels", function (err, collection) {
      if (err) throw err;
      console.log("Successfully connected to collection");
      var newChannel = new channel_model({
        _id: new mongoose.Types.ObjectId(),
        name: title,
        ds_id: id,
        falls: "{}",
        scores: "{}",
        last_season: last_season,
        channel_picture: channel_pic,
      });

      newChannel.save(function (err) {
        if (err) throw err;

        console.log("Channel successfully saved.");
        //mongoose.connection.close();
      });
    });
  });
}

client.login(token);

var is_sent = false

seasonChecker()

function seasonChecker(){
  var date = moment()
  if(date.date() == 30 && date.hour() == 12 && is_sent == false && date.minute() >= 25 && date.minute() <= 50){
    updateGuilds()
  }
  setTimeout(seasonChecker, 65000)
}