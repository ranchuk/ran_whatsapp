
let connections = [];
const Chat = require('./config/models/chat');

const socketStart = (http) => {
    var client = require("socket.io")(http);
    var jwt = require('jsonwebtoken');

  client.use(function(socket, next){
      if (socket.handshake.query && socket.handshake.query.token){
          jwt.verify(socket.handshake.query.token, require('./config/keys/keys').secretOrKey, function(err, decoded) {
            if(!err){
              socket.decoded = decoded;
              // console.log('**********DECODED SOCKET TOKEN************')
              // console.log(socket.decoded)
              // console.log('**********DECODED SOCKET TOKEN************')
              next();
            }
          });
      } else {
          console.error('**********ERROR DECODED SOCKET TOKEN************');
          // next(new Error('Authentication error'));
      }    
    })
  client.on("connection", socket => {
      socket.on("join", function(user) {
        // TO DO - update only "friends" contacts and not all online users
      connections.forEach(item => {
        client
          .to(item.username)
          .emit("online_status", {
            username: user.username,
            status: "online"
          });
      });
      connections.push({ username: user.username, id: socket.id });
      socket.join(user.username);
      console.log(`----------------------------------------------`)
      console.log(`${user.username} connected succefully`)
      console.log('online users: ',connections);
      console.log(`----------------------------------------------`)
    });
    socket.on("disconnect", () => {
      let diconnectedUsername = "";
      connections = connections.filter(item => {
        if (item.id.toString().trim() === socket.id.toString().trim()) {
          diconnectedUsername = item.username;
          return false;
        } else {
          return true;
        }
      });
      console.log(`----------------------------------------------`)
      console.log(`${diconnectedUsername} disconncted succefully`)
      console.log('online users: ',connections);
      console.log(`----------------------------------------------`)

    // TO DO - update only "friends" contacts and not all online users
      connections.forEach(item => {
        client
          .to(item.username)
          .emit("online_status", {
            username: diconnectedUsername,
            status: "offline"
          });
      });
    });

    socket.on("clientWriting", function(data) {
      console.log(data)
      if (client.sockets.adapter.rooms[data.reciever]) {
        client.to(data.reciever).emit("clientWriting", data);
      }
    });

    socket.on("clientNewMessage", function(data) {
      const username1 = data.sender;
      const username2 = data.reciever;
      data.time = new Date()
      client.to(data.reciever).emit("clientWriting", { length: 0 });
      Chat.find({
        $or: [
          { $and: [{ username1: username1 }, { username2: username2 }] },
          { $and: [{ username1: username2 }, { username2: username1 }] }
        ]
      })
        .then(chat => {
          // console.log(chat);
          //Add to chat array
          chat[0].chat.push(data);
          chat[0]
            .save()
            .then(chat => {
              if (client.sockets.adapter.rooms[data.reciever]) {
                // console.log(data.reciever);
                client.to(data.reciever).emit("clientNewMessage", data);
              }
              if (client.sockets.adapter.rooms[data.sender]) {
                // console.log(data.sender);

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
}


module.exports = {
    getConnections : () => connections,
    socketStart
}