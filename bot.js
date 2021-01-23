const Discord = require('discord.js');
const client = new Discord.Client();
const configfile = require('./data/config.json')
const prefix = configfile.prefix
const token = configfile.token
const commands = require('./commands.json')
const falls_of_users = {}

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  if (message.content.split(" ")[0] === commands.repeat) {
    let user = message.mentions.members.first();
    console.log(user.kick())
    let textCommand = message.content.split(" ")
    let deletedElement = textCommand.splice(0, 1)
    message.reply(message.author.username + ": " + textCommand.join(" "));
  }
});

client.on('message', message => {
  if (message.content.split(" ")[0] === commands.gfall){
    //if (message.member.roles.find(role => role.name === 'The Boyare')){}
    if (typeof(message.content.split(" ")[2]) !== 'string'){
      message.reply('clarify the user\'s misconduct with a comment {b!fall <username> <comment>}')
      
    }else{
    let user = message.mentions.members.first();
    falls_of_users[user] = (falls_of_users[user] || 0) + 1
    if(falls_of_users[user] >= 3){
      user.kick()
      message.reply('User has been kicked, because user has collected 3 falls!')
    }
    else{
      message.reply(user.user.username + ' has already collected ' + falls_of_users[user] + ' falls in case of ' + message.content.split(" ").slice(2).join(" ") + "!")
    }
  }
  }
})

client.login(token);