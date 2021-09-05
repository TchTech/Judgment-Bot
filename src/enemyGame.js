const Discord = require("discord.js");
const client = new Discord.Client({
});
const disbut = require("discord-buttons");
//disbut(client);

// var    enemy_pos = {}
// var    enemy_rounds = {}

function randomNumber(min, max) {
    const r = Math.random() * (max - min) + min;
    return Math.floor(r);
  }

class enemyFight{

    constructor(message, menu_id, positions_name, author_id, hero_emoji, enemy_emoji, field_emoji, help_text, right_answer_msg, bad_answer_msg, win_msg){
        this.command_msg = message
        this.author_id = author_id
        this.hero_emoji = hero_emoji
        this.enemy_emoji = enemy_emoji
        this.field_emoji = field_emoji
        this.help_text = help_text
        this.right_answer_msg = right_answer_msg
        this.bad_answer_msg = bad_answer_msg
        this.win_msg = win_msg
        this.positions = positions_name
        this.menu_id = menu_id
        this.is_closed = false
        this.enemy_pos = {}
        this.enemy_rounds = {}
    }
 enemyFightProcess(){
    let pos = randomNumber(1, 6)
          let i = 1
          let pos_arr = []
          const pos_emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
          while(i <=5){
            if(pos == i) pos_arr.push(pos_emojis[i-1] + /*"✈"*/this.hero_emoji + "--" + this.enemy_emoji /*"🚁"*/)
            else pos_arr.push(pos_emojis[i-1] + /*"✈"*/this.hero_emoji + "--" +  this.field_emoji/*"🌩"*/)
            i += 1
          }
          let memberPath = this.command_msg.guild.id + ":" + this.author_id
          this.enemy_pos[memberPath] = pos
          i = 0
          let first_option = new disbut.MessageMenuOption()
              .setLabel('First position')
              .setEmoji('1️⃣')
              .setValue(this.positions[0])
          let second_option = new disbut.MessageMenuOption()
              .setLabel('Second position')
              .setEmoji('2️⃣')
              .setValue(this.positions[1])
          let third_option = new disbut.MessageMenuOption()
              .setLabel('Third position')
              .setEmoji('3️⃣')
              .setValue(this.positions[2])
          let fourth_option = new disbut.MessageMenuOption()
              .setLabel('Fourth position')
              .setEmoji('4️⃣')
              .setValue(this.positions[3])    
          let fifth_option = new disbut.MessageMenuOption()
              .setLabel('Fifth position')
              .setEmoji('5️⃣')
              .setValue(this.positions[4])
          let pos_select = new disbut.MessageMenu()
              .setID(this.menu_id)
              .setPlaceholder('Click me! :D')
              .setMaxValues(1)
              .setMinValues(1)
              .addOptions(first_option, second_option, third_option, fourth_option, fifth_option)
          this.command_msg.channel.send(pos_arr.join("\n") + "\n" + this.help_text, pos_select)
          this.fightTimeout = setTimeout(this.enemyClose, 10000, memberPath, this.command_msg.channel, this.enemy_pos, this.enemy_rounds, this.is_closed)
}
 enemyMenuListener(menu){
        //const poses = ["1_pos", "2_pos", "3_pos", "4_pos", "5_pos"]
        //if(menu.values[0] === "1_pos" || menu.values[0] === "2_pos" || menu.values[0] === "3_pos" || menu.values[0] === "4_pos" || menu.values[0] === "5_pos"){
        if(this.is_closed !== true){
        this.positions.forEach((pos, index)=>{
        if(pos == menu.values[0]){
        let memberPath = menu.guild.id + ":" + menu.clicker.id
            if(this.enemy_pos[memberPath] != undefined) {
                console.log(this.enemy_pos)
                if(this.enemy_pos[memberPath] === index+1){
                menu.message.channel.send(/*"**Правильно!** Ваш ответ принят."*/this.right_answer_msg)
                this.enemy_rounds[memberPath] = (this.enemy_rounds[memberPath] || 0) + 1
                if(this.enemy_rounds[memberPath] >= 4){
                    this.enemyClose(memberPath, this.command_msg.channel, this.enemy_pos, this.enemy_rounds, this.is_closed)
                    clearTimeout(this.fightTimeout)
                    menu.message.channel.send(/*"**Вы победили!**"*/this.win_msg)
                }else{
                    delete this.enemy_pos[memberPath]
                    clearTimeout(this.fightTimeout)
                    this.enemyFightProcess()
                }
                menu.reply.defer()
                menu.message.delete()
                }else{
                menu.message.channel.send(/*"**Неправильно!** Сбор ответов закочен."*/this.bad_answer_msg)
                this.enemyClose(memberPath, this.command_msg.channel, this.enemy_pos, this.enemy_rounds, this.is_closed)
                menu.reply.defer()
                }
            }}
    })
    }
}

 enemyClose(memberPath, channel, enemy_pos, enemy_rounds, is_closed){
    if(enemy_pos[memberPath] != undefined){
    delete enemy_pos[memberPath]
    if(enemy_rounds[memberPath] != undefined) delete enemy_rounds[memberPath]
    channel.send("Прием ответов закрыт!")
    is_closed = true
  }
}
}

module.exports = enemyFight