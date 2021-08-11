const Discord = require("discord.js");
const client = new Discord.Client({
//  ws: { intents: "GUILD_MEMBERS" },
});
const token = require("./data/config.json").king_token

client.on("ready", ()=>{
    client.user.setActivity("Пропишите b!games")
})

// client.on("messageReactionAdd", (reaction, user)=>{
//     if(reaction.emoji.name == "✅" && reaction.message.author.id == "274930301917069313" && reaction.message.content == "Поставьте галочку для верификации, если вы знаете и согласны с правилами сервера."){
        
//     }
// })

// client.on("messageReactionRemove", (reaction, user)=>{
//     if(reaction.emoji.name == "✅" && reaction.message.author.id == "274930301917069313" && reaction.message.content == "Поставьте галочку для верификации, если вы знаете и согласны с правилами сервера."){
//         reaction.message.guild.roles.fetch("870948025286156308").then((role)=>{
//             reaction.message.guild.members.fetch(user.id).then((member)=>{
//                 member.roles.remove(role)
//             })
//         })
//     }
// })

client.on("message", (msg)=>{
    console.log(msg.guild.roles)
    switch(msg.content.split(" ")[0]){
        case "b!verify":
            msg.guild.roles.fetch("870948025286156308").then((role)=>{
                msg.member.roles.add(role).then(()=>{
                    msg.react("✅")
                })
            })
        break
        // case "b!deleteverify":
        //     msg.guild.roles.fetch("870948025286156308").then((role)=>{
        //         msg.member.roles.remove(role)
        //     })
        // break
        case "b!games":
            msg.reply("Спасибо что спросили! На данный момент доступны эти роли:\n`b!dwarf`: **Dwarf-Fortress-Gamer**;\n`b!rust`: **Rust-Gamer**;\n`b!roblox`: **Roblox-Gamer**;\n`b!starve`: **Dont-Starve-Gamer**;\n`b!minecraft`: **Minecraft-Gamer**;\n`b!amongus`: **Amongus-Gamer**;\n`b!terraria`: **Terraria-Gamer**;\n`b!nintendo`: **NINTENDO-Gamer**;\n`b!gta`: **GTA-Gamer**;\n`b!wot`: **WOT-Gamer**;\n`b!csgo`: **Counter-Strike-Gamer**;\n`b!pubg`: **PUBG-Gamer**;\n")
            break
        case "b!minecraft":
            let minecraft_role = msg.guild.roles.cache.get("858709693088923658")
            msg.member.roles.add(minecraft_role)
            msg.reply("Вы получили роль `Minecraft-Gamer`. Теперь вы имеете доступ к категории о **Minecraft**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!mute":
            if(msg.member.hasPermission("ADMINISTRATOR")){
            let mute_role = msg.guild.roles.cache.get("807348064742146088")
            let lawbreaker = msg.mentions.members.first()
            lawbreaker.roles.remove(lawbreaker.roles.cache)
            .then(()=>{lawbreaker.roles.add(mute_role).then(()=>{
            msg.reply("Мьют прошел успешно, спасибо!")}
            )})}
            else msg.reply('НЕТ ПРАВ.')
            break
        case "b!amongus":
            let amongus_role = msg.guild.roles.cache.get("858822236109406238")
            msg.member.roles.add(amongus_role)
            msg.reply("Вы получили роль `Among-Us-Gamer`. Теперь вы имеете доступ к категории об **Among us**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!starve":
            let starve_role = msg.guild.roles.cache.get("871495227100266566")
            msg.member.roles.add(starve_role)
            msg.reply("Вы получили роль `Dont-Starve-Gamer`. Теперь вы имеете доступ к категории о **Dont Starve Together**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!dwarf":
            let dwarf_role = msg.guild.roles.cache.get("871495649064022057")
            msg.member.roles.add(dwarf_role)
            msg.reply("Вы получили роль `Dwarf-Fortress-Gamer`. Теперь вы имеете доступ к категории о **Dworf Fortress**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!roblox":
            let roblox_role = msg.guild.roles.cache.get("871496128288407552")
            msg.member.roles.add(roblox_role)
            msg.reply("Вы получили роль `Roblox-Gamer`. Теперь вы имеете доступ к категории о **Roblox**.\n*Спасибо за использование нашего сервиса!*")
            break
        case "b!rust":
            let rust_role = msg.guild.roles.cache.get("871495641099038741")
            msg.member.roles.add(rust_role)
            msg.reply("Вы получили роль `Rust-Gamer`. Теперь вы имеете доступ к категории о **Rust**.\n*Спасибо за использование нашего сервиса!*")
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