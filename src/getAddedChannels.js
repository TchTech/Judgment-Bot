const mongoose = require("mongoose")
const mongo_uri = require("../data/config.json").mongo_uri
var channel_model = require("../channel_model");

async function getAddedChannels(
  //callback
  ) {
  return new Promise(resolve => {
    let added_channels_ids = []
     mongoose.connect(mongo_uri, (err) => {
      if (err) throw err;
      mongoose.connection.db.collection("channels", (err) => {
        if (err) throw err;
        channel_model.find({}).then((channels)=>{
            channels.forEach((channel, index, array) => {
                added_channels_ids.push(channel.ds_id);
                if(index + 1 === array.length){
                    //callback(added_users_ids)
                    resolve(added_channels_ids)
              };
        })
      });
    })
  })
})
}
module.exports.getAddedChannels = getAddedChannels