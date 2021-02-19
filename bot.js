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

function fallsPermission(){
  is_allowed_to_fall = true;
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
    message.reply(message.author.username  + " said: " + textCommand.join(" "));
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
    
    let roles_array = []
    message.member.roles.cache.forEach((a) => {roles_array.push(a.name)})

    if(roles_array.includes("Lawbreaker")){
      message.reply(
        message.author.username + " is the Lawbreaker, that's why i will not listen to him!"
      )
    }else{
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
        if(is_allowed_to_fall === false){
          message.reply("Sorry, I have not got that permission now. Try to wait for a while...")
        }else{
        falls_of_users[user] = (falls_of_users[user] || 0) + 1; //ADD FALL TO COLLECTED FALLS
        if (falls_of_users[user] >= 3) {
          //FINAL KICK IF COLLECTED SETTED NUMBERS OF FALLS (THREE)
          let bool_err = false;
          user.kick().catch((err)=>{message.reply("ERROR APPEARED: " + err.message)
          bool_err = true});
         // KICK
         if(bool_err != true){
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
          }}
        }
      }
    }
  }
});

client.on("message", (message) => {
  if (message.content.split(" ")[0] === commands.conflict) {
    let lawbreaker = message.mentions.members.first()
        conflicts[message.mentions.members.first()] = {
      reporter: message.author.username,
      reason: message.content.split(' ').slice(3).join(" "),
      punishment: message.content.split(" ").slice(2, 3).join(" ")}
      //console.log(conflicts[message.mentions.members.first()])
      //message.reply('Предстать @everyone перед судом! На данный момент ' + conflicts[message.mentions.members.first()].reporter + ' устроил конфликт с ' + lawbreaker.user.username + ' из-за того, что ' + conflicts[message.mentions.members.first()].reason + '.\nПредложенное решение: ' + conflicts[message.mentions.members.first()].punishment + '.')
      message.channel.send('Предстать @everyone перед судом! На данный момент ' + conflicts[message.mentions.members.first()].reporter + ' устроил конфликт с ' + lawbreaker.user.username + ' из-за того, что ' + conflicts[message.mentions.members.first()].reason + '.\nПредложенное решение: ' + conflicts[message.mentions.members.first()].punishment + '.')
      .then((m)=>{m.react('👍')
                  m.react('👎')})
    }
});

client.login(token);
