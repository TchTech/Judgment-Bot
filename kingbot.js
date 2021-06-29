const Discord = require("discord.js");
const client = new Discord.Client({
//  ws: { intents: "GUILD_MEMBERS" },
});
const token = require("./data/config.json").king_token

client.on("ready", ()=>{
    client.user.setActivity("Пропишите b!games")
})

client.on("message", (msg)=>{
    console.log(msg.guild.roles)
    switch(msg.content.split(" ")[0]){
        case "b!games":
            msg.reply("Спасибо что спросили! На данный момент доступны 7 ролей:\n`b!minecraft`: **Minecraft-Gamer**;\n`b!terraria`: **Terraria-Gamer**;\n`b!nintendo`: **NINTENDO-Gamer**;\n`b!gta`: **GTA-Gamer**;\n`b!wot`: **WOT-Gamer**;\n`b!csgo`: **Counter-Strike-Gamer**;\n`b!pubg`: **PUBG-Gamer**;\n")
            break
        case "b!minecraft":
            let minecraft_role = msg.guild.roles.cache.get("858709693088923658")
            msg.member.roles.add(minecraft_role)
            msg.reply("Вы получили роль `Minecraft-Gamer`. Теперь вы имеете доступ к категории о **Minecraft**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!terraria":
            let terraria_role = msg.guild.roles.cache.get("858714294724329472")
            msg.member.roles.add(terraria_role)
            msg.reply("Вы получили роль `Terraria-Gamer`. Теперь вы имеете доступ к категории о **Terraria**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!csgo":
            let csgo_role = msg.guild.roles.cache.get("858715522370633798")
            msg.member.roles.add(csgo_role)
            msg.reply("Вы получили роль `Counter-Strike-Gamer`. Теперь вы имеете доступ к категории о **CS:GO**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!wot":
            let wot_role = msg.guild.roles.cache.get("858715937259388968")
            msg.member.roles.add(wot_role)
            msg.reply("Вы получили роль `WOT-Gamer`. Теперь вы имеете доступ к категории о **World Of Tanks**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!pubg":
            let pubg_role = msg.guild.roles.cache.get("858716603574386698")
            msg.member.roles.add(pubg_role)
            msg.reply("Вы получили роль `PUBG-Gamer`. Теперь вы имеете доступ к категории о **PlayerUnknown's BattleGrounds**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!nintendo":
            let nintendo_role = msg.guild.roles.cache.get("858717300127301632")
            msg.member.roles.add(nintendo_role)
            msg.reply("Вы получили роль `Nintendo-Gamer`. Теперь вы имеете доступ к категории о **NINTENDO-GAMES**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!gta":
            let gta_role = msg.guild.roles.cache.get("858718793319710720")
            msg.member.roles.add(gta_role)
            msg.reply("Вы получили роль `GTA-Gamer`. Теперь вы имеете доступ к категории о **GTA-ONLINE**.\n*Спасибо за использование нашего сервиса!*")
            break
    }
})

client.login(token)