const express = require("express");
const router = express.Router();
const getConnections = require("../../socket").getConnections;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const verifyToken = require('../../config/passport').verifyToken;

// Load User model
const User = require("../../config/models/user");
const Chat = require("../../config/models/chat");
router.put("/messagesReadUpdate", verifyToken, (req, res) => {

  const { _id }= req.body;
  const decoded_token = req.decoded_token;
  console.log(
  {
    _id,
    decoded_token_username: decoded_token.username
  }
  )

  if(decoded_token){
    Chat.findById(_id)
      .then(chat => {
          chat.chat.forEach(message => {
            if(message.reciever === decoded_token.username){
              message.isRead = true;
            }
          });
  
          // chat.chat = newChatArray
          chat.save()
          .then((chat)=>{
            res.status(200).json({ success: true, chat});
          })
          .catch((err)=>{
              console.error(err);
              res.status(404).json({ success: false });
          })
       })
      .catch(err => {
        console.error(err);
      });
  }
  else{
    res.status(404).json({ success: false });
  }
});

router.get("/getChats", verifyToken, (req, res) => {

    const decoded_token = req.decoded_token;
  
    if(decoded_token){
      Chat.find({
        $or: [{ username1: decoded_token.username }, { username2: decoded_token.username }]
      })
        .then(chats => {
          const connections = getConnections();
          const newChats = chats.map(chat => {
            const isUserOnline = connections.find(
              connection =>
                connection.username === chat.username1 ||
                connection.username === chat.username2
            );
            chat = JSON.parse(JSON.stringify(chat));
            chat.isOnline = isUserOnline ? true : false;
            return chat;
          });
          res.status(200).json({ success: true, username: decoded_token.username, chats: newChats });
        })
        .catch(err => {
          console.error(err);
        });
    }
    else{
      res.status(404).json({ success: false });
    }
});

router.delete("/delete/:username1/:username2",verifyToken, (req, res) => {
    const username1 = req.params.username1;
    const username2 = req.params.username2;
    Chat.find({
      $or: [
        { $and: [{ username1: username1 }, { username2: username2 }] },
        { $and: [{ username1: username2 }, { username2: username1 }] }
      ]
    })
      .then(chat => {
        //delete chat between 2 clients
        chat[0].chat = [];
        chat[0].save().then(chat => {
          console.log(`Delete successfull chat of ${username1} and ${username2}`);
          res.json({ success: true, chat: chat });
        });
      })
      .catch(err => {
        socket.emit("status", s);
  
        console.error(err);
      });
  });

module.exports = router;
