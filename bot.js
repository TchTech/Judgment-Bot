const Discord = require("discord.js");
const client = new Discord.Client();
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
const mongo_uri =
  "mongodb+srv://admin:kira2007@bot.ljnsg.mongodb.net/judgment-bot-discord";
var conflict_model = require('./conflict_model');
const moment = require("moment");
const { findByIdAndUpdate } = require("./user_model");

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
  servers_member,
  profile_pic_link
) {
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
        connected_servers: servers_member,
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

client.on("ready", () => {
  console.log("I am ready!");
  console.log(Discord.version);
});

// Create an event listener for messages
client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.repeat) {
    //let user = message.mentions.members.first();
    //console.log(user.kick())
    let textCommand = message.content.split(" ");
    let deletedElement = textCommand.splice(0, 1);
    message.reply(message.author.username + " said: " + textCommand.join(" "));
  }
});

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.help) {
    message.reply(help_messages["eng-help-msg"]);
  }
});

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.ru_help) {
    message.reply(help_messages["ru-help-msg"]);
  }
});

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.gfall) {
    // CHECK IS THERE ARE ANY FALL COMMAND
    //if (message.member.roles.find(role => role.name === 'The Boyare')){} CHECKING OF THE ROLE

    let roles_array = [];
    message.member.roles.cache.forEach((a) => {
      roles_array.push(a.name);
    });

    if (roles_array.includes("Lawbreaker")) {
      message.reply(
        message.author.username +
          " is the Lawbreaker, that's why i will not listen to him!"
      );
    } else {
      if (typeof message.content.split(" ")[2] !== "string") {
        //WRONG MESSAGE OF SYNTAX
        message.reply(
          "clarify the user's misconduct with a comment {`b!fall <username> <comment>`}"
        );
      } else {
        //DO THE MASSIVE AS A KEY WITH CASES AND FALLS

        let user = message.mentions.members.first(); //GETTING THE NAME OF THE LAWBREAKER
        if (user == undefined) {
          message.reply(
            "You've written something wrong. Maybe linked name isn't user's (maybe linked name of role). If you didn't use linked name of the role, try again."
          );
        } else {
          if (is_allowed_to_fall === false) {
            message.reply(
              "Sorry, I have not got that permission now. Try to wait for a while..."
            );
          } else {
            falls_of_users[user] = (falls_of_users[user] || 0) + 1; //ADD FALL TO COLLECTED FALLS
            if (falls_of_users[user] >= 3) {
              //FINAL KICK IF COLLECTED SETTED NUMBERS OF FALLS (THREE)
              let bool_err = false;
              user.kick().catch((err) => {
                message.reply("ERROR APPEARED: " + err.message);
                bool_err = true;
              });
              // KICK
              if (bool_err != true) {
                message.reply(
                  user.user.username +
                    " has been kicked, because user has collected " +
                    falls_of_users[user] +
                    " fall(s)!"
                );
              }
            } else {
              //THE MESSAGE OF NEW FALL (HASN'T COLLECTED SETTED NUMBER OF FALLS)
              message.reply(
                user.user.username +
                  " has already collected " +
                  falls_of_users[user] +
                  " fall(s) in case of " +
                  message.content.split(" ").slice(2).join(" ") +
                  "!"
              );
              //is_allowed_to_fall = false;
              //setTimeout(fallsPermission, 1800000, 'funky')
            }
          }
        }
      }
    }
  }
});

function jundgment(){}

function conflictConfirmation(msg, conflict_id_str, punishment){
  mongoose.set('useFindAndModify', true)
  mongoose.connect(mongo_uri, (err)=>{
     if(err) throw err
     mongoose.connection.db.collection('conflicts', (err)=>{
      if(err) throw err
      
  try{
      const reactions = msg.reactions.cache;
      let positive_votes = reactions.get('👍');
      let negative_votes = reactions.get('👎'); 

    if(positive_votes.count > negative_votes.count){
      switch(punishment){
        case "fall":
          conflict_model.findByIdAndUpdate(conflict_id_str, {support_votes: positive_votes.count,
          decline_votes: negative_votes.count, 
        is_confirmed: "YES"}, (err, conflict)=>{if(err) throw err
          mongoose.connection.db.collection('users', (err)=>{
            user_model.findOneAndUpdate({ds_id: conflict.lawbreaker}, {$inc: {'ds_id': 1}}, (err, user)=>{
              if(user.falls >= 3){
                user_model.findOneAndUpdate({ds_id: conflict.lawbreaker}, {falls: 0})
                console.log(msg.guild.cache.get(conflict.lawbreaker))
              }
            })
          })})
        
        break;
      }
    }else if(positive_votes.count < negative_votes.count){
      console.log('Noo')
    }else if(positive_votes.count === negative_votes.count){
      console.log('Equalss')
    }
  }catch(err){
    console.log(err)
  }
})})
}


function registration_of_user(
  name,
  id,
  falls,
  conflicts,
  servers_member,
  profile_pic_link
) {
  createUser(name, id, falls, conflicts, servers_member, profile_pic_link);
}

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.registartion){
    mongoose.connect(mongo_uri, (err)=>{
      if(err) throw err
      mongoose.connection.db.collection('users', (err)=>{
        if(err) throw err
        user_model.findOne({ds_id: message.author.id}, (err, user)=>{
          if(err) throw err
          if(user == undefined){
            createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
            message.reply("You was included to database successfully! Now you have ability for conflicts! Hooray!🎆\n*Вы были успешно добавлены в базу данных! Отныне у вас есть возможность конфликтовать! Урра!🎆*")
          }else{
            message.reply("Oops... You was already included to database. You've already got conflict ability.\n*Упс... Вы уже были добавлены в базу данных. Вы уже получили возможность конфликтовать.*")
          }
        })
      }) 
    })
  }
})

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.introducing){
    message.reply("Настоящее сообщение с 22.03.21 (0.3):\n*Предлагаем вам внести свои данные в базу данных для получения возможности конфликтов.\n И да... насчет конфликтов... на даный момент команда `b!conflict <нарушитель> <наказание (fall-kick-ban)> <причина>` не работает (НЕ ИСПОЛЬЗУЙТЕ ЕЁ), но разработка ведется до сих пор.\nВводить `b!reg` не обязательно, но тем самым вы поможете разработке. Конец сообщения.*")
}})

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.conflict) {
    let conflict_id = new mongoose.Types.ObjectId();
    let lawbreaker = message.mentions.members.first();
    let author_in_db;
    let authors_id = message.author.id;
    console.log(authors_id);
    //createUser(message.author.username, message.author.id, 0, [0], [message.guild.id], message.author.avatarURL())
    mongoose.set('useFindAndModify', true)
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true)
    mongoose.connect(mongo_uri, (err, client) => {
      if (err) throw err;
      mongoose.connection.db.collection("users", (err) => {
        if (err) throw err;
        author_in_db = user_model.findOne({ ds_id: authors_id }, (err) => {
          if (err) throw err;
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
              "."
          )
          .then((m) => {
            m.react("👍");
            m.react("👎");
            try{
              setTimeout(/*43200000*/conflictConfirmation, 20000, m, conflict_id._id.toHexString(), conflicts[message.mentions.members.first()].punishment)
              } catch(e){
                console.log(e)
              }
          });
          // var newUser = new user_model({
          //   _id: new mongoose.Types.ObjectId(),
          //   nickname: name,
          //   ds_id: id,
          //   falls: falls,
          //   conficts_member: conflicts,
          //   connected_servers: servers_member,
          //   profile_picture: profile_pic_link,
          // });
    
          // newUser.save(function (err) {
          //   if (err) throw err;
    
          //   console.log("User successfully saved.");
          //   mongoose.connection.close();
      });
      mongoose.connection.db.collection('conflicts', (err)=>{
        if(err) throw err
        let newConflict = new conflict_model({
          _id: conflict_id,
          case: conflicts[message.mentions.members.first()].reason,
          reporter: message.author.id,
          lawbreaker: message.mentions.members.first(),
		      punishment: conflicts[message.mentions.members.first()].punishment,
		      support_votes: 1,
		      decline_votes: 1,
		      judgment_date: moment().add(12, 'hours').toDate(),
		      is_confirmed: 'IN_WORK'
        })
        newConflict.save((err)=>{if(err) throw err})
        //console.log(conflict_id._id.toHexString())
        
      })
    });

    //console.log(conflicts[message.mentions.members.first()])
    //message.reply('Предстать @everyone перед судом! На данный момент ' + conflicts[message.mentions.members.first()].reporter + ' устроил конфликт с ' + lawbreaker.user.username + ' из-за того, что ' + conflicts[message.mentions.members.first()].reason + '.\nПредложенное решение: ' + conflicts[message.mentions.members.first()].punishment + '.')
  }
});

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.census) {
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
      setTimeout(censusPermission, 360000, "funky");
    }
  }
});

client.login(token);
