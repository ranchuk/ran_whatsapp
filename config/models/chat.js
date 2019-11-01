const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const ChatSchema = new Schema(
  {
    username1: {
      type: String
    },
    username2: {
      type: String
    },
    chat: [
      {
        time: String,
        sender: String,
        reciever: String,
        message: String
      }
    ]
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

module.exports = Chat = mongoose.model("chats", ChatSchema);
