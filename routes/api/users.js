const express = require("express");
const router = express.Router();

// Load User model
const User = require("../../config/models/user");
const Chat = require("../../config/models/chat");

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Find user by email
  User.findOne({ username: username })
    .then(user => {
      // Check for user
      if (!user || user.password !== password) {
        return res.status(404).json("User not found");
      }
      Chat.find({
        $or: [{ username1: username }, { username2: username }]
      })
        .then(chats => {
          res.json({ success: true, chats: chats });
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
});

router.delete("/chat/delete/:username1/:username2", (req, res) => {
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
