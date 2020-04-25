const express = require("express");
const router = express.Router();
const verifyToken = require('../../config/passport').verifyToken;

// Load User model
const User = require("../../config/models/user");
const Chat = require("../../config/models/chat");
const connections = require("../../socket").getConnections();
router.post("/newContact",verifyToken, (req, res) => {
  const { username, contact } = req.body;

  // Find user by email
  User.findOne({ username: contact })
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(200).json({message :"User not exist"});
      }
      const username1 = username;
      const username2 = contact;
      Chat.find({
        $or: [
          { $and: [{ username1: username1 }, { username2: username2 }] },
          { $and: [{ username1: username2 }, { username2: username1 }] }
        ]
      })
        .then(chat => {
          // console.log(chat);
          if (chat.length !== 0) {
            return res.status(200).json({message: "Chat already exist"});
          }
          let newChat = new Chat({
            username1: username,
            username2: contact,
            chat: []
          });

          newChat
            .save()
            .then(chat => {
              const newChat = {...JSON.parse(JSON.stringify(chat)), isOnline: connections.find((connection)=>connection.username === contact)}
              res.status(200).json({message: "success", newChat})
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
});


router.get("/searchUser",verifyToken, async (req, res) => {
  const { query } = req.query;
  //Find user by email
  try{
    let users = await User.find({ username: { "$regex": query, "$options": "i" }}, {username: true, _id: 0})
    users = users && users.filter((user)=>user.username !== req.decoded_token.username).map(user=>user.username) // remove myself from list
    if (!users) {
      return res.status(200).json("User not exist");
    }
    else{
      const results = JSON.parse(JSON.stringify(users));
      return res.status(200).json({message: "success", results});

    }
  }
  catch(e){
    return res.status(404).json(e.message);
  }
});
// router.post("/chat/addmessage", (req, res) => {
//   const username1 = req.body.sender;
//   const username2 = req.body.reciever;
//   const data = req.body;
//   console.log(username1, username2);
//   Chat.find({
//     $or: [
//       { $and: [{ username1: username1 }, { username2: username2 }] },
//       { $and: [{ username1: username2 }, { username2: username1 }] }
//     ]
//   })
//     .then(chat => {
//       //Add to comment array
//       chat[0].chat.push(data);
//       chat[0].save().then(chat => res.json({ success: true, chat: chat }));
//     })
//     .catch(err => {
//       socket.emit("status", s);

//       console.error(err);
//     });
// });

// router.post("/addMessage", (req, res) => {
//   const data = req.body;
//   if (client.sockets.adapter.rooms[data.reciever]) {
//     client.to(data.reciever).emit("clientWriting", data);
//   }
// });

module.exports = router;
