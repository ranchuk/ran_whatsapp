const express = require("express");
const router = express.Router();
const getConnections = require("../../socket").getConnections;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Load User model
const User = require("../../config/models/user");
const Chat = require("../../config/models/chat");

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    return res.status(404).json("User not found");
  }
  if(getConnections().find(connection =>connection.username === username)){
    return res.status(404).json("User already logged in");
  }
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


router.post("/logout", (req, res) => {
  res.json({ success: true });
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

module.exports = router;
