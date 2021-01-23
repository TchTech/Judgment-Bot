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
  // If the message is "what is my avatar"
  if (message.content.split(" ")[0] === commands.answer) {
    // Send the user's avatar URL
    let textCommand = message.content.split(" ")
    let deletedElement = textCommand.splice(0, 1)
    message.reply(message.author.username + ": " + textCommand.join(" "));
  }
});

client.login(token);