var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:kira2007@bot.ljnsg.mongodb.net/judgment-bot-discord?retryWrites=true&w=majority', function (err) {
  if(err){
    console.log(err)
  }
  else{
    console.log("SUCESS... maybe...")
  }
})