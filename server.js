const express = require("express");
const app = express();
var http = require("http").Server(app);
const path = require("path");
const bodyparser = require("body-parser");
const loggerMiddleware = require('./utils').loggerMiddleware;
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const chats = require("./routes/api/chats");

// var winston = require('winston');
// var expressWinston = require('express-winston');

const connectDB = require('./config/connectDB');
const socketStart  = require('./socket').socketStart;
//Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(loggerMiddleware)

// Use Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/chats", chats);

connectDB(function(err, db) {
  if (err) {
    throw err;
  }
  socketStart(http)
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
})
