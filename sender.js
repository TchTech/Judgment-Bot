const Discord = require("discord.js");
const client = new Discord.Client();
const configfile = require("./data/config.json");
const token = configfile.token;

client.on("ready", ()=>{
    console.log("Here we go!")
    client.guilds.cache.find(guild=>guild.id == '799694472186560572').members.fetch({cache: false}).then((members)=>{
        console.log(JSON.stringify(members))
        JSON.parse(JSON.stringify(members)).forEach((member)=>{
        let user = client.users.cache.get(member.userID)
        if(member.userID == '484694365566926859'){user.send("***ВАУ!***\nЕсли вы получили данное сообщение, Вы приглашены в наш уютнейший сервер, наполненный звуками холодного счета машин и криками геймеров.\nВ данном сервере вы можете:\n*1. Испытать меня (ЛАМАЙ МЕНЯ ПОЛНАСТЬЮ!).\n2.Получать свежие новости из мира игр и айти (есть даже скриншоты battlefield 6... только тсс!)\n3.Развлечься в каналах для командной игры (Если они вдруг понадобятся).*\n\n***БОЖЕ МОЙ! Я УЖЕ ВЕСЬ ВО ВНИМАНИИ!*** Но это еще не всё, ведь на этом сервере вы сможете получать анонсы обнов бота (`Кое-что еще реализую... Хе-Хе-Хе...`).\nССЫЛКА НА ОФИЦИАЛЬНЫЙ СЕРВЕР: https://discord.gg/FGSCs9S4UY")
         } })
    }    )
})

client.login(token);