const express = require("express");
const app = express();
var http = require("http").Server(app);
var client = require("socket.io")(http);
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const keys = require("./config/keys/keys");
//Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const users = require("./routes/api/users");
// Use Routes
app.use("/api/users", users);
const connections = [];
// Connect to mongo
mongoose.connect(
  keys.mongoURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  function(err, db) {
    if (err) {
      throw err;
    }
    client.on("connection", socket => {
      // console.log(socket);
      connections.push(socket.id);
      console.log(connections);

      socket.on("join", function(username) {
        socket.join(username);
      });

      socket.on("clientWriting", function(data) {
        // if (client.sockets.adapter.rooms[data.reciever]) {
        //   client.to(data.reciever).emit("clientWriting", data);
        // }
      });

      socket.on("clientNewMessage", function(data) {
        const username1 = data.sender;
        const username2 = data.reciever;
        Chat.find({
          $or: [
            { $and: [{ username1: username1 }, { username2: username2 }] },
            { $and: [{ username1: username2 }, { username2: username1 }] }
          ]
        })
          .then(chat => {
            //Add to chat array
            chat[0].chat.push(data);
            chat[0]
              .save()
              .then(chat => {
                if (client.sockets.adapter.rooms[data.reciever]) {
                  client.to(data.reciever).emit("clientNewMessage", data);
                }
                if (client.sockets.adapter.rooms[data.sender]) {
                  client.to(data.sender).emit("clientNewMessage", data);
                }
              })
              .catch(err => console.error(err));
          })
          .catch(err => {
            console.error(err);
          });
      });

      // let chat = db.collection("chats");

      // // Create function to send status
      // const sendStatus = function(s) {
      //   socket.emit("status", s);
      // };

      // // Get chats from mongo collection
      // chat
      //   .find()
      //   .limit(100)
      //   .sort({ _id: 1 })
      //   .toArray(function(err, res) {
      //     if (err) {
      //       throw err;
      //     }

      //     // Emit the messages
      //     socket.emit("output", res);
      //   });

      // // Handle input events
      // socket.on("input", function(data) {
      //   let name = data.name;
      //   let message = data.message;

      //   // Check for name and message
      //   if (name === "" || message === "") {
      //     // Send error status
      //     sendStatus("Please enter a name and message");
      //   } else {
      //     // Insert message
      //     chat.insert({ name: name, message: message }, function() {
      //       client.emit("output", [data]);

      //       // Send status object
      //       sendStatus({
      //         message: "Message sent",
      //         clear: true
      //       });
      //     });
      //   }
      // });

      // socket.on("writing", function(data) {
      //   console.log(data);
      //   if (data.messageLength !== 0)
      //     socket.broadcast.emit("writing", `${data.username} is writing...`);
      //   else {
      //     socket.broadcast.emit("stoppedWriting");
      //   }
      // });
      // // // Handle clear
      // // socket.on("clear", function(data) {
      //   // Remove all chats from collection
      //   chat.remove({}, function() {
      //     // Emit cleared
      //     socket.emit("cleared");
      //   });
      // });
    });

    //Server static assets if in production
    if (process.env.NODE_ENV === "production") {
      //Set static folder
      app.use(express.static("client/build"));

      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
      });
    }

    const PORT = process.env.PORT || 5000;

    var server = http.listen(PORT, () => {
      console.log("server is running on port", server.address().port);
    });
  }
);
