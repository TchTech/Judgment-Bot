const Discord = require("discord.js");
const client = new Discord.Client({
});
const disbut = require("discord-buttons");
var mongoose = require("mongoose")
const channel_model = require("../channel_model");
var user_model = require("../user_model");

function randomNumber(min, max) {
    const r = Math.random() * (max - min) + min;
    return Math.floor(r);
  }
  
//   var { shields, bombs, warriors } = randomGameGenerate();
//   var result_arr = emojiGenerate(shields, bombs, warriors);
//   console.log(result_arr.join(""))
//   console.log()
  function emojiGenerate(player_x, player_y, dragon_x, dragon_y) {
    var result_arr = [];
    var i = 5;
    while (i > 0) {
      let variant = variants[randomNumber(0, 3)];
      switch (variant) {
        case "shield":
          if (shields > 0) {
            result_arr.push("🛡");
            shields = shields - 1;
            i = i - 1;
          }
          break;
        case "bomb":
          if (bombs > 0) {
            result_arr.push("💣");
            bombs = bombs - 1;
            i = i - 1;
          }
          break;
        case "warrior":
          if (warriors > 0) {
            result_arr.push("💂‍♂️");
            warriors = warriors - 1;
            i = i - 1;
          }
          break;
      }
    }
    return result_arr;
  }
  
  function randomPositionsGenerate() {
    let generating = true
    while(generating){
    var player_x = randomNumber(1, 6);
    var player_y = randomNumber(1, 6);
    var dragon_x = randomNumber(1, 6);
    var dragon_y = randomNumber(1, 6);
    if(string(player_x) + string(player_y) != string(dragon_x) + string(dragon_y)) generating = false
    }
    return {player_x, player_y, dragon_x, dragon_y};
  }

class tacticalFight{
    constructor(message, menu_id, author_id, help_text, right_answer_msg, bad_answer_msg, win_msg, mongo_url){
        this.command_msg = message
        this.author_id = author_id
        // this.shield_emoji = shield_emoji
        // this.warrior_emoji = warrior_emoji
        // this.bomb_emoji = bomb_emoji
        this.help_text = help_text
        this.right_answer_msg = right_answer_msg
        this.bad_answer_msg = bad_answer_msg
        this.win_msg = win_msg
        var { shields, bombs, warriors } = randomGameGenerate()
        this.shields = shields
        this.bombs = bombs
        this.warriors = warriors
        this.game_field_arr = emojiGenerate(shields, bombs, warriors)
        this.menu_id = menu_id
        this.game_fields = {}
        this.mongo_uri = mongo_url
        //this.enemy_rounds = {}
    }
    tacticalFightProcess(field_arr){
        let memberPath = this.command_msg.guild.id + ":" + this.author_id
        this.game_fields[memberPath] = this.game_field_arr
          let first_option = new disbut.MessageMenuOption()
              .setLabel('First position')
              .setEmoji('1️⃣')
              .setValue(field_arr[0] + "_0")
          let second_option = new disbut.MessageMenuOption()
              .setLabel('Second position')
              .setEmoji('2️⃣')
              .setValue(field_arr[1] + "_1")
          let third_option = new disbut.MessageMenuOption()
              .setLabel('Third position')
              .setEmoji('3️⃣')
              .setValue(field_arr[2] + "_2")
          let fourth_option = new disbut.MessageMenuOption()
              .setLabel('Fourth position')
              .setEmoji('4️⃣')
              .setValue(field_arr[3] + "_3")    
          let fifth_option = new disbut.MessageMenuOption()
              .setLabel('Fifth position')
              .setEmoji('5️⃣')
              .setValue(field_arr[4] + "_4")
          let pos_select = new disbut.MessageMenu()
              .setID(this.menu_id)
              .setPlaceholder('Click me! :D')
              .setMaxValues(1)
              .setMinValues(1)
              .addOptions(first_option, second_option, third_option, fourth_option, fifth_option)
          this.command_msg.channel.send(field_arr.join("") + "\n1️⃣2️⃣3️⃣4️⃣5️⃣\n\n🏹🏹🏹🏹🏹\n" + this.help_text, pos_select)
          this.tacticTimeout = setTimeout(this.tacticClose, 10000, memberPath, this.command_msg.channel, this.field_arr, this.game_fields, this.tacticTimeout)
    }
    enemyMenuListener(menu){
      let memberPath = menu.guild.id + ":" + menu.clicker.id
        if(this.game_fields[memberPath] != undefined){
        this.game_field_arr.forEach((pos, index)=>{
        if(pos+"_"+index == menu.values[0]){
            switch(pos){
            case "🛡":
                this.game_field_arr[index] = "❌"
                let has_shields = false
                this.game_field_arr.forEach((emojii)=>{
                    if(emojii == "🛡") has_shields=true
                })
                if(has_shields == false){
                    this.win(memberPath, menu)
                }else{
                    this.reroll(menu)
                }
                break
              case "💣":
                if(this.checkBombedWarriors(this.game_field_arr, index) == false){
                if(index > 0) this.game_field_arr[index - 1] = "❌" //TODO: MULTI-BOMB
                if(index < 5) this.game_field_arr[index + 1] = "❌"
                this.game_field_arr[index] = "❌"
                let has_shields = false
                this.game_field_arr.forEach((emojii)=>{
                    if(emojii == "🛡") has_shields=true
                })
                if(has_shields == false){
                    this.win(memberPath, menu);
                }else{
                    this.reroll(menu);
                }
              }else{
                this.lose(memberPath, menu);
              }
              break
            case "💂‍♂️":
                this.lose(memberPath, menu);
                break
            case "❌":
                this.lose(memberPath, menu)
                break
              }
            menu.message.delete()
        }
    })
    }
}

  win(memberPath, menu) {
    mongoose.connect(this.mongo_uri, (err)=>{
      if(err) throw err
       channel_model.findOne({ds_id: this.command_msg.guild.id}, (err, channel)=>{
         if(err) throw err
         channel.servonces = (channel.servonces || 0) + 8
         channel.save()
         this.channel_servonces = channel.servonces
       }).then(()=>{
       user_model.findOne({ds_id: this.author_id}, (err, user)=>{
        if(err) throw err
        user.servonces = (user.servonces || 0) + 2
        this.command_msg.channel.send(this.game_field_arr.join("") + "\n" + this.win_msg + "\nNow you have " + ((user.servonces || 0) + 2) + " servonces!\nServer has " + (this.channel_servonces || 0) + " servonces!");
        this.tacticClose(memberPath, this.command_msg.channel, this.game_field_arr, this.game_fields, this.tacticTimeout);
        menu.reply.defer();
        user.save()
      })
    })
    })
  }

  reroll(menu) {
    clearTimeout(this.tacticTimeout);
    this.tacticalFightProcess(this.game_field_arr);
    menu.reply.defer();
  }

  lose(memberPath, menu) {
    this.command_msg.channel.send(this.bad_answer_msg);
    this.tacticClose(memberPath, this.command_msg.channel, this.game_field_arr, this.game_fields, this.tacticTimeout);
    menu.reply.defer();
  }

checkBombedWarriors(game_field_arr, index){
  let result_bool = false
  if(index == 0){
    if(game_field_arr[index + 1] == "💂‍♂️") result_bool = true
  } else if(index == 4){
    if(game_field_arr[index - 1] == "💂‍♂️") result_bool = true
  } else{
    if(game_field_arr[index + 1] == "💂‍♂️") result_bool = true
    if(game_field_arr[index - 1] == "💂‍♂️") result_bool = true
  }
return result_bool
}

tacticClose(memberPath, channel, enemy_pos, enemy_rounds, timeout){
    if(timeout !== null) clearTimeout(timeout)
    if(enemy_rounds[memberPath] != undefined) delete enemy_rounds[memberPath]
    channel.send("Прием ответов закрыт!")
  }
}

module.exports = {
    tacticalFight
}  