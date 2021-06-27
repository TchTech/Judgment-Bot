const mongoose = require("mongoose")
const mongo_uri = require("../data/config.json").mongo_uri
var user_model = require("../user_model");

async function getAddedUsers(
  //callback
  ) {
  return new Promise(resolve => {
    let added_users_ids = []
     mongoose.connect(mongo_uri, (err) => {
      if (err) throw err;
      mongoose.connection.db.collection("users", (err) => {
        if (err) throw err;
        user_model.find({}).then((users)=>{
            users.forEach((user, index, array) => {
                added_users_ids.push(user.ds_id);
                if(index + 1 === array.length){
                    mongoose.connection.close()
                    //callback(added_users_ids)
                    resolve(added_users_ids)
              };
        })
      });
    })
  })
})
}
module.exports.getAddedUsers = getAddedUsers