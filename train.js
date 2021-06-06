const Discord = require('discord.js');
const config = require('./data/config.json')
const token = config.token
client.on('message', async (message) => {
  if (command === 'hello') {
    await message.channel.send('Hello!!');
  }
}

function loginBot() {
  client.login(token);
}

exports.client = client;
exports.loginBot = loginBot;