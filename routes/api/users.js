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

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    return res.status(404).json("User not found");
  }
  // console.log({username, password})
  //Find user by email
  User.findOne({ username: username })
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json("User not found");
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if(result){
          Chat.find({
            $or: [{ username1: username }, { username2: username }]
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
              jwt.sign(
                {username: user.username}, 
                require('../../config/keys/keys').secretOrKey, { expiresIn: '1h' }, 
                (err, token)=>{
                  res.json({ success: true, username, chats: newChats, token });
              });
            })
            .catch(err => {
              console.error(err);
            });
        }
        else{
          res.status(404).json('Passowrd not correct')
          console.error(err);
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
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

router.post("/logout", (req, res) => {
  res.json({ success: true });
});

router.delete("/chat/delete/:username1/:username2",verifyToken, (req, res) => {
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

router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Find user by email
  User.findOne({ username: username })
    .then(user => {
      // Check for user
      if (user) {
        return res.status(404).json("User already exist");
      }
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            const newUser = new User({
              username: username,
              password: hash
            });
      
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
        });
    });
    })
    .catch(err => {
      console.error(err);
    });
});
router.post("/newContact",verifyToken, (req, res) => {
  const { username, contact } = req.body;

  //Find user by email
  User.findOne({ username: contact })
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json("User not exist");
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
            return res.status(404).json("Chat already exist");
          }
          const newChat = new Chat({
            username1: username,
            username2: contact,
            chat: []
          });

          newChat
            .save()
            .then(user => res.json(newChat))
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
    const users = await User.find({ username: { "$regex": query, "$options": "i" } })
    if (!users) {
      return res.status(200).json("User not exist");
    }
    else{
      const results = JSON.parse(JSON.stringify(users));
      return res.status(200).json({success: true, results});

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
