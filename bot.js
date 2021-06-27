const Discord = require("discord.js");
const client = new Discord.Client({
//  ws: { intents: "GUILD_MEMBERS" },
});
var cron = require('node-cron');
const configfile = require("./data/config.json");
const prefix = configfile.prefix;
const token = configfile.token;
const commands = require("./commands.json");
const falls_of_users = {};
const help_messages = require("./helps.json");
//const db_work = require("./db_work");
var is_allowed_to_fall = true;
const conflicts = {};
var is_allowed_to_census = true;
var mongoose = require("mongoose");
var user_model = require("./user_model");
const mongo_uri = configfile.mongo_uri
var conflict_model = require("./conflict_model");
const moment = require("moment");
const channel_model = require("./channel_model");
var added_users_ids = [];
const getAddedUsers = require("./src/getAddedUsers").getAddedUsers

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};


// MAIN TODO: SEASONS AND THEN DB USERS ADD; SAVE ALL ADDED IDS IN ARRAY IN READY; MAKE FEWER USER PRINT IN RATING;


/*TODO: B!OPTION;
        HELP FIX;
        FALLS REFORMATION;
        FASTER RATING;
        LOGS;
        TRY-CATCH;
        SITE;
        SEASONS;
        GAME-ROLES;
        LANGUAGE MODES;
        README.MD;
        TYPING;
        TESTS;
        ~NOTIFIER;
        */


client.on("ready", () => {
  console.log("I am ready!");
  console.log(Discord.version);
  client.user.setActivity(
    "Type b!enghelp for English help (Пропишите b!ruhelp для помощи на Русском)"
  );
  getAddedUsers().then((users)=>{added_users_ids = users;});
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
      "Упсс... На данный момент вы не можете общаться со мной лично... Для этого есть сервера! Look at {official-j-bot-site-link-soon}"
    );
  } else {
    if (message.content.split(" ")[0] === commands.cregistration) {
      mongoose.connect(mongo_uri, (err) => {
        if (err) throw err;
        mongoose.connection.db.collection("channels", (err) => {
          if (err) throw err;
          channel_model.findOne({ ds_id: message.guild.id }, (err, channel) => {
            if (err) throw err;
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
    if (
      !message.author.bot &&
      client.guilds.cache.get(message.guild.id).member(message.author.id)
    ) {
        checkUserInDB(message);
        giveScores(message);
    } else {
      if(message.author.id !== '799723410572836874'){message.react("🚫")}
    }
    switch (message.content.split(" ")[0]) {
      case commands.score:
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
        mongoose.connect(mongo_uri, (err) => {
          if (err) throw err;
          mongoose.connection.db.collection("channels", (err) => {
            if (err) throw err;
            let authors_id = message.author.id.toString();
            channel_model.findOne(
              { ds_id: message.guild.id },
              (err, channel) => {
                if (err) throw err;
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
                asyncRating(channel, message);
              }
            );
          });
        });
        break;
      case commands.uregistration:
        mongoose.connect(mongo_uri, (err) => {
          if (err) throw err;
          mongoose.connection.db.collection("users", (err) => {
            if (err) throw err;
            user_model.findOne({ ds_id: message.author.id }, (err, user) => {
              if (err) throw err;
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
        break;
      case commands.birthday:
        if (message.mentions.members.first() !== undefined) {
          message.channel
            .send(
              "Внимание, @everyone ! Сегодня день рождения у пользователя `" +
                message.mentions.members.first().user.username +
                "` ! Поздравляем его с этим замечательным днём и желаем всего исключительно наилучшего!\n***УРА!!***"
            )
            .then((msg) =>
              sleep(5000).then(
                msg.reactions.cache
                  .get("484535447171760141")
                  .then((msg) => msg.react("🎆"))
              )
            );
        } else {
          message.channel.send("Упс... Вы некорректно использовали команду...");
        }
        break;
      case commands.introducing:
        message.reply(
          "Настоящее сообщение с 09.04.21 (0.5):\n@everyone Мы всё еще предлагаем вам внести свои данные в базу данных для получения возможности конфликтов при помощи `b!reg`.\n И да... насчет конфликтов... на даный момент команда `b!conflict <нарушитель> <наказание (fall-kick-ban)> <причина>` ЗАРАБОТАЛА!!! Тестируйте её по поооооолной! Конец сообщения."
        );
        break;
      case commands.conflict:
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
          mongoose.set("useFindAndModify", true);
          mongoose.set("useNewUrlParser", true);
          mongoose.set("useUnifiedTopology", true);
          mongoose.connect(mongo_uri, (err, client) => {
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
                    [0],
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
                    [0],
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
                      7200000,
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
        }
        break;
      case commands.census:
        if (is_allowed_to_census === false) {
          message.reply(
            "Sorry, please, you should wait for a while, because censuses are created too often."
          );
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
          setTimeout(censusPermission, 900000);
        }
        break;
      case commands.ru_help:
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
            "https://cdn.discordapp.com/app-icons/799723410572836874/683e0c1d8a42a80bc4fd727cccafec85.png"
          );

        message.channel.send(helpEmbed);
        break;
      case commands.repeat:
        let textCommand = message.content.split(" ");
        let deletedElement = textCommand.splice(0, 1);
        message.reply(
          message.author.username + " said: " + textCommand.join(" ")
        );
        console.log(
          message.author.username + " said: " + textCommand.join(" ")
        );
        break;
      case commands.en_help:
        message.reply(help_messages["eng-help-msg"]);
        break;
    }
  }
});

cron.schedule('0 0 1 * *', () => {
  mongoose.set("useFindAndModify", true);
          mongoose.set("useNewUrlParser", true);
          mongoose.set("useUnifiedTopology", true);
          mongoose.connect(mongo_uri, (err, client) => {
            if (err) throw err;
            mongoose.connection.db.collection("channels", (err) => {
              
            })
          })
})
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
      let obj = JSON.parse(JSON.parse(JSON.stringify(channel.scores)));
      let day = moment().date();
      let score;
      if (day == 1 || day == 10 || day == 20 || day == 30) {
        score = (obj[authors_id] || 0) + 16 + randomNumber(0, 4);
        message.react("🎈");
      } else {
        score = (obj[authors_id] || 0) + 9 + randomNumber(0, 4);
      }
      obj[authors_id] = score;
      channel.scores = JSON.stringify(obj);
      channel.save();
    });
  })
  });
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
        "https://cdn.discordapp.com/app-icons/799723410572836874/683e0c1d8a42a80bc4fd727cccafec85.png"
      );
    message.channel.send(ratingEmbed);
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
              fallProcess(positive_votes, negative_votes);
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
  function fallProcess(positive_votes, negative_votes) {
    conflict_model.findByIdAndUpdate(
      conflict_id_str,
      {
        support_votes: positive_votes.count,
        decline_votes: negative_votes.count,
        is_confirmed: "YES",
      },
      (err, conflict) => {
        if (err) throw err;
        mongoose.connection.db.collection("users", (err) => {
          console.log(conflict.lawbreaker.toString());
          user_model.findOneAndUpdate(
            { ds_id: conflict.lawbreaker.toString() },
            { $inc: { falls: 1 } },
            (err, user) => {
              if (err) throw err;
              console.log(user);
              let user_lawbreaker = msg.guild.members.cache.get(
                conflict.lawbreaker.toString()
              );
              msg.channel.send(
                "@everyone Внимание! По конфликту №`" +
                  conflict_id_str +
                  "` было вынесено решение в пользу пожаловавшегося!\nРешение: `fall` для `" +
                  user_lawbreaker.user.username +
                  "`;\n На данный момент у `" +
                  user_lawbreaker.user.username +
                  "` `" +
                  (user.falls + 1) +
                  "` фолл(а);"
              );
              if (user.falls + 1 >= 3) {
                if (user_lawbreaker.kickable === false) {
                  msg.channel.send(
                    "ERROR: USER ISN'T KICKABLE. HIS FALLS: `" +
                      user.falls +
                      "`\nномер конфликта: `" +
                      conflict_id_str +
                      "`"
                  );
                } else {
                  user_model.findOneAndUpdate(
                    { ds_id: conflict.lawbreaker.toString() },
                    { falls: 0 },
                    (err) => {
                      if (err) throw err;
                    }
                  );
                  msg.channel.send(
                    "Пользователь `" +
                      user_lawbreaker.user.username +
                      "` Набрал МАКСИМУМ фоллов(в связи с последним конфликтом номер `" +
                      conflict_id_str +
                      "`), а значит суд изгоняет его из сервера! GOODBYE!"
                  );
                  user_lawbreaker.kick();
                }
              }
            }
          );
        });
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
        mongoose.connection.close();
      });
    });
  });
}

function createChannel(title, id, channel_pic) {
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
        falls: {},
        scores: "{}",
        channel_picture: channel_pic,
      });

      newChannel.save(function (err) {
        if (err) throw err;

        console.log("Channel successfully saved.");
        mongoose.connection.close();
      });
    });
  });
}

client.login(token);

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.cregistration){

//     mongoose.connect(mongo_uri, (err)=>{
//       if(err) throw err
//       mongoose.connection.db.collection('channels', (err)=>{
//         if(err) throw err
//         channel_model.findOne({ds_id: message.guild.id}, (err, channel)=>{
//           if(err) throw err
//           if(channel == undefined){
//             createChannel(message.guild.name, message.guild.id, message.guild.iconURL())
//             message.reply("Channel was included to database successfully! Now you have many abilities like score-getting! Hooray!🎆\n*Канал был успешно добавлен в базу данных! Отныне у вас есть возможности вроде получения баллов! Урра!🎆*")
//           }else{
//             message.reply("Oops... You was already included to database.\n*Упс... Вы уже были добавлены в базу данных.*")
//           }
//         })
//       })
//     })
//   }
// })

// Create an event listener for messages
// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.repeat) {
//     //let user = message.mentions.members.first();
//     //console.log(user.kick())
//     let textCommand = message.content.split(" ");
//     let deletedElement = textCommand.splice(0, 1);
//     message.reply(message.author.username + " said: " + textCommand.join(" "));
//     console.log(message.author.username + " said: " + textCommand.join(" "));
//   }
// });

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.help) {
//     message.reply(help_messages["eng-help-msg"]);
//   }
// });

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.ru_help) {
//     //message.reply(help_messages["ru-help-msg"]);
//     const helpEmbed = new Discord.MessageEmbed()
//       .setColor("#a6550c")
//       .setTitle("***Help page***")
//       .setThumbnail(message.author.avatarURL())
//       .setDescription("Последнее сообщение (07.05.2021)")
//       .addFields(
//         {
//           name: "`b!help`",
//           value: "тоже самое что и `b!ruhelp`, но на английском языке!",
//         },
//         { name: "`b!repeat <message>`", value: "Повторение `message`." },
//         {
//           name: "`b!conflict <linked-users-name> <punishment {fall, kick, ban}> <case>`",
//           value:
//             "Краеугольная функция нашего бота. Она позволяет сделать конфликт (пожаловаться) на преступника. Решение выносится через 2 часа. Опробуйте её!",
//           inline: true,
//         },
//         {
//           name: "`b!fall <linked-users-name> <case>`",
//           value:
//             "***ДАННАЯ ФУНКЦИЯ НЕ РАБОТАЕТ НА ДАННЫЙ МОМЕНТ!*** Выдает предупреждение преступнику. За 3 фолла - кик!",
//           inline: true,
//         }
//       )
//       .setTimestamp()
//       .setFooter(
//         "Judgment-bot by TchTech",
//         "https://cdn.discordapp.com/app-icons/799723410572836874/683e0c1d8a42a80bc4fd727cccafec85.png"
//       );

//     message.channel.send(helpEmbed);
//   }
// });

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.gfall) {
//     // CHECK IS THERE ARE ANY FALL COMMAND
//     //if (message.member.roles.find(role => role.name === 'The Boyare')){} CHECKING OF THE ROLE

//     let roles_array = [];
//     message.member.roles.cache.forEach((a) => {
//       roles_array.push(a.name);
//     });

//     if (roles_array.includes("Lawbreaker")) {
//       message.reply(
//         message.author.username +
//           " is the Lawbreaker, that's why i will not listen to him!"
//       );
//     } else {
//       if (typeof message.content.split(" ")[2] !== "string") {
//         //WRONG MESSAGE OF SYNTAX
//         message.reply(
//           "clarify the user's misconduct with a comment {`b!fall <username> <comment>`}"
//         );
//       } else {
//         //DO THE MASSIVE AS A KEY WITH CASES AND FALLS

//         let user = message.mentions.members.first(); //GETTING THE NAME OF THE LAWBREAKER
//         if (user == undefined) {
//           message.reply(
//             "You've written something wrong. Maybe linked name isn't user's (maybe linked name of role). If you didn't use linked name of the role, try again."
//           );
//         } else {
//           if (is_allowed_to_fall === false) {
//             message.reply(
//               "Sorry, I have not got that permission now. Try to wait for a while..."
//             );
//           } else {
//             falls_of_users[user] = (falls_of_users[user] || 0) + 1; //ADD FALL TO COLLECTED FALLS
//             if (falls_of_users[user] >= 3) {
//               //FINAL KICK IF COLLECTED SETTED NUMBERS OF FALLS (THREE)
//               let bool_err = false;
//               user.kick().catch((err) => {
//                 message.reply("ERROR APPEARED: " + err.message);
//                 bool_err = true;
//               });
//               // KICK
//               if (bool_err != true) {
//                 message.reply(
//                   user.user.username +
//                     " has been kicked, because user has collected " +
//                     falls_of_users[user] +
//                     " fall(s)!"
//                 );
//               }
//             } else {
//               //THE MESSAGE OF NEW FALL (HASN'T COLLECTED SETTED NUMBER OF FALLS)
//               message.reply(
//                 user.user.username +
//                   " has already collected " +
//                   falls_of_users[user] +
//                   " fall(s) in case of " +
//                   message.content.split(" ").slice(2).join(" ") +
//                   "!"
//               );
//               //is_allowed_to_fall = false;
//               //setTimeout(fallsPermission, 1800000, 'funky')
//             }
//           }
//         }
//       }
//     }
//   }
// });

// client.on("message", (message)=>{
//   if(message.content.split(" ")[0] === commands.rating){
//   mongoose.set('useFindAndModify', true)
//   mongoose.set('useNewUrlParser', true)
//   mongoose.set('useUnifiedTopology', true)
//   mongoose.connect(mongo_uri, (err)=>{
//      if(err) throw err
//      mongoose.connection.db.collection('channels', (err)=>{
//         if(err) throw err
//         channel_model.findOne({ds_id: message.guild.id}, (err, channel)=>{
//           console.log(err, channel)
//           if(err) throw err
//           asyncRating(channel, message)
//      })})
//     })
// }})

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.uregistration){

//     mongoose.connect(mongo_uri, (err)=>{
//       if(err) throw err
//       mongoose.connection.db.collection('users', (err)=>{
//         if(err) throw err
//         user_model.findOne({ds_id: message.author.id}, (err, user)=>{
//           if(err) throw err
//           if(user == undefined){
//             createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
//             message.reply("You was included to database successfully! Now you have ability for conflicts! Hooray!🎆\n*Вы были успешно добавлены в базу данных! Отныне у вас есть возможность конфликтовать! Урра!🎆*")
//           }else{
//             message.reply("Oops... You was already included to database. You've already got conflict ability.\n*Упс... Вы уже были добавлены в базу данных. Вы уже получили возможность конфликтовать.*")
//           }
//         })
//       })
//     })
//   }
// })

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.introducing){
//     message.reply("Настоящее сообщение с 09.04.21 (0.5):\n@everyone Мы всё еще предлагаем вам внести свои данные в базу данных для получения возможности конфликтов при помощи `b!reg`.\n И да... насчет конфликтов... на даный момент команда `b!conflict <нарушитель> <наказание (fall-kick-ban)> <причина>` ЗАРАБОТАЛА!!! Тестируйте её по поооооолной! Конец сообщения.")
// }})

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.conflict) {
//     if(message.mentions.members.first() === undefined){
//       message.reply("Error: вы не указали пользователя, которого хотите осудить.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`")
//     } else if(message.content.split(" ")[3] === undefined){
//       message.reply("Error: вы не указали причину вашего обращения.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`")
//     } else if(message.content.split(" ")[2] !== "fall" && message.content.split(" ")[2] !== "ban" && message.content.split(" ")[2] !== "kick"){
//       message.reply("Error: вы указали неверное значение наказания (или не указали его вовсе). Корректные значения: `fall`, `kick`, `ban`.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`")
//     } else if(message.mentions.members.first().user.id === "799723410572836874"){
//       message.reply("Error: Ты серьёзно? Ты пошел жаловаться на суд в суд..? Не-а, так не получится.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`")
//     } else if(message.author.id === message.mentions.members.first().id){
//       message.reply("Error: извините, но вы не можете жаловаться на самого себя.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`")
//     }
//     else{ //CHECK IN DB
//     let conflict_id = new mongoose.Types.ObjectId();
//     let lawbreaker = message.mentions.members.first();
//     let authors_id = message.author.id;
//     console.log(authors_id);
//     //createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
//     mongoose.set('useFindAndModify', true)
//     mongoose.set('useNewUrlParser', true)
//     mongoose.set('useUnifiedTopology', true)
//     mongoose.connect(mongo_uri, (err, client) => {
//       if (err) throw err;
//       mongoose.connection.db.collection("users", (err) => {
//         if (err) throw err;
//         user_model.findOne({ ds_id: authors_id }, (err, user) => {
//           if (err) throw err;
//           if(user === null){
//             createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
//             message.reply("Уупс... Вы не были занесены в базу даных... Но мы сами (автоматически) добавили вас в базу!\n(*Продолжаем оформление конфликта...*)")
//           }
//         });
//         user_model.findOne({ ds_id: lawbreaker.user.id }, (err, user) => {
//           if (err) throw err;
//           if(user === null){
//             createUser(lawbreaker.user.username, lawbreaker.user.id, 0, [0], [message.guild.id], lawbreaker.user.avatarURL())
//             message.reply("Уупс... Преступник не был занесён в базу даных... Но мы сами (автоматически) добавили его(её) в базу!\n(*Продолжаем оформление конфликта...*)")
//           }
//         });
//         conflicts[message.mentions.members.first()] = {
//           reporter: message.author.username,
//           reason: message.content.split(" ").slice(3).join(" "),
//           punishment: message.content.split(" ").slice(2, 3).join(" "),
//         };
//         message.channel
//           .send(
//             "Предстать @everyone перед судом! На данный момент " +
//               conflicts[message.mentions.members.first()].reporter +
//               " устроил конфликт с " +
//               lawbreaker.user.username +
//               " из-за того, что " +
//               conflicts[message.mentions.members.first()].reason +
//               ".\nПредложенное решение: " +
//               conflicts[message.mentions.members.first()].punishment +
//               ".\n`ID конфликта: " + conflict_id.toHexString() + "`"
//           )
//           .then((m) => {
//             m.react("👍");
//             m.react("👎");
//             try{
//               setTimeout(/*43200000*/conflictConfirmation, 7200000, m, conflict_id._id.toHexString(), conflicts[message.mentions.members.first()].punishment)
//               } catch(e){
//                 console.log(e)
//               }
//           });
//       });
//       createConflict(conflict_id, message);
//     });
//   }
// }});

// client.on("message", (message) => {
//   if (message.content.split(" ")[0] === commands.census) {
//     if (is_allowed_to_census === false) {
//       message.reply(
//         "Sorry, please, you should wait for a while, because censuses are created too often."
//       );
//     } else {
//       //message.reply('Предстать @everyone перед судом! На данный момент ' + conflicts[message.mentions.members.first()].reporter + ' устроил конфликт с ' + lawbreaker.user.username + ' из-за того, что ' + conflicts[message.mentions.members.first()].reason + '.\nПредложенное решение: ' + conflicts[message.mentions.members.first()].punishment + '.')
//       let comment = message.content.split(" ").slice(1).join(" ");
//       let is_empty = false;
//       if (comment === "") is_empty = true;
//       is_empty
//         ? message.channel
//             .send(
//               "Внимание, @everyone , была предложена перепись мнения (ну или сенсус). Настоятельно предлагаем поучавствовать в голосовании-опросе:\n *Довольны ли вы устройством сервера?*"
//             )
//             .then((m) => {
//               m.react("👍");
//               m.react("👎");
//             })
//         : message.channel
//             .send(
//               'Внимание, @everyone , была предложена перепись мнения (ну или сенсус). Настоятельно предлагаем поучавствовать в голосовании-опросе:\n *"' +
//                 comment +
//                 '"*'
//             )
//             .then((m) => {
//               m.react("👍");
//               m.react("👎");
//             });
//       is_allowed_to_census = false;
//       setTimeout(censusPermission, 360000);
//     }
//   }
// });

//else if (message.content.split(" ")[0] === ) {

//   } else if (message.content.split(" ")[0] === ) {

//   } else if (message.content.split(" ")[0] === commands.conflict) {
//     if (message.mentions.members.first() === undefined) {
//       message.reply(
//         "Error: вы не указали пользователя, которого хотите осудить.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
//       );
//     } else if (message.content.split(" ")[3] === undefined) {
//       message.reply(
//         "Error: вы не указали причину вашего обращения.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
//       );
//     } else if (
//       message.content.split(" ")[2] !== "fall" &&
//       message.content.split(" ")[2] !== "ban" &&
//       message.content.split(" ")[2] !== "kick"
//     ) {
//       message.reply(
//         "Error: вы указали неверное значение наказания (или не указали его вовсе). Корректные значения: `fall`, `kick`, `ban`.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
//       );
//     } else if (
//       message.mentions.members.first().user.id === "799723410572836874"
//     ) {
//       message.reply(
//         "Error: Ты серьёзно? Ты пошел жаловаться на суд в суд..? Не-а, так не получится.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
//       );
//     } else if (message.author.id === message.mentions.members.first().id) {
//       message.reply(
//         "Error: извините, но вы не можете жаловаться на самого себя.\nНапоминаем синтаксис написания команды: `b!conflict <преступник> <наказание (fall, kick, ban)> <причина>`"
//       );
//     } else {
//       //CHECK IN DB
//       let conflict_id = new mongoose.Types.ObjectId();
//       let lawbreaker = message.mentions.members.first();
//       let authors_id = message.author.id;
//       console.log(authors_id);
//       //createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
//       mongoose.set("useFindAndModify", true);
//       mongoose.set("useNewUrlParser", true);
//       mongoose.set("useUnifiedTopology", true);
//       mongoose.connect(mongo_uri, (err, client) => {
//         if (err) throw err;
//         mongoose.connection.db.collection("users", (err) => {
//           if (err) throw err;
//           user_model.findOne({ ds_id: authors_id }, (err, user) => {
//             if (err) throw err;
//             if (user === null) {
//               createUser(
//                 message.author.username,
//                 message.author.id,
//                 0,
//                 [0],
//                 [message.guild.id],
//                 message.author.avatarURL()
//               );
//               message.reply(
//                 "Уупс... Вы не были занесены в базу даных... Но мы сами (автоматически) добавили вас в базу!\n(*Продолжаем оформление конфликта...*)"
//               );
//             }
//           });
//           user_model.findOne({ ds_id: lawbreaker.user.id }, (err, user) => {
//             if (err) throw err;
//             if (user === null) {
//               createUser(
//                 lawbreaker.user.username,
//                 lawbreaker.user.id,
//                 0,
//                 [0],
//                 [message.guild.id],
//                 lawbreaker.user.avatarURL()
//               );
//               message.reply(
//                 "Уупс... Преступник не был занесён в базу даных... Но мы сами (автоматически) добавили его(её) в базу!\n(*Продолжаем оформление конфликта...*)"
//               );
//             }
//           });
//           conflicts[message.mentions.members.first()] = {
//             reporter: message.author.username,
//             reason: message.content.split(" ").slice(3).join(" "),
//             punishment: message.content.split(" ").slice(2, 3).join(" "),
//           };
//           message.channel
//             .send(
//               "Предстать @everyone перед судом! На данный момент " +
//                 conflicts[message.mentions.members.first()].reporter +
//                 " устроил конфликт с " +
//                 lawbreaker.user.username +
//                 " из-за того, что " +
//                 conflicts[message.mentions.members.first()].reason +
//                 ".\nПредложенное решение: " +
//                 conflicts[message.mentions.members.first()].punishment +
//                 ".\n`ID конфликта: " +
//                 conflict_id.toHexString() +
//                 "`"
//             )
//             .then((m) => {
//               m.react("👍");
//               m.react("👎");
//               try {
//                 setTimeout(
//                   /*43200000*/ conflictConfirmation,
//                   7200000,
//                   m,
//                   conflict_id._id.toHexString(),
//                   conflicts[message.mentions.members.first()].punishment
//                 );
//               } catch (e) {
//                 console.log(e);
//               }
//             });
//         });
//         createConflict(conflict_id, message);
//       });
//     }
//   } else if (message.content.split(" ")[0] === commands.census) {
//     }
//   }
// });
