const Discord = require("discord.js");
const client = new Discord.Client({
  // ws: { intents: ["GUILDS", "GUILD_MEMBERS"] },
});
const configfile = require("./data/config.json");
const token = configfile.token;

client.login(token);

client.guilds.cache.get('711853917151035452').send('Внимание, @everyone ! Сегодня день рождения у пользователя @frogmeme#7211 ! Поздравляем его с этим замечательным днём  и желаем исключительно наилучшего!\n***УРА!!***').then(msg=>msg.react('🎆'))

