const Discord = require("discord.js");
const client = new Discord.Client();
const configfile = require("./data/config.json");
const token = configfile.token;
const moment = require("moment");
const { time } = require("console");
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  });
  readline.question('Введите нововведение:', news => {
	const newsEmbed = new Discord.MessageEmbed()
	.setColor('#dfef59')
	.setTitle('***Анонс!***')
  .setThumbnail(client.user.avatarURL())
	.setDescription('*Вас ожидает следующие нововведения...*')
	.addFields([
		{ name: '\n' + news, value: '\nКак вам такое?'}
	])
	.setTimestamp()
	.setFooter('Judgment-bot by TchTech', 'https://cdn.discordapp.com/app-icons/799723410572836874/683e0c1d8a42a80bc4fd727cccafec85.png');
	client.channels.cache.get('846821447585234964').send(newsEmbed).then((m) => {
		m.react("👍");
		m.react("👎");
	})
	readline.close();
	//process.exit(0)
  });
client.login(token);
