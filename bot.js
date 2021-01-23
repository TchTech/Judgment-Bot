const Discord = require('discord.js');
const client = new Discord.Client();
const configfile = require('./data/config.json')
const prefix = configfile.prefix
const token = configfile.token
const commands = require('./commands.json')

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  if (message.content.split(" ")[0] === commands.repeat) {
    //let user = message.mentions.members.first();
    //console.log(user)
    let textCommand = message.content.split(" ")
    let deletedElement = textCommand.splice(0, 1)
    message.reply(message.author.username + ": " + textCommand.join(" "));
  }
});

client.login(token);