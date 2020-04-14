const express = require("express");
const app = express();
var http = require("http").Server(app);
const path = require("path");
const bodyparser = require("body-parser");
const loggerMiddleware = require('./utils').loggerMiddleware;
const users = require("./routes/api/users");
// var winston = require('winston');
// var expressWinston = require('express-winston');

const connectDB = require('./config/connectDB');
const socketStart  = require('./socket').socketStart;
//Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(loggerMiddleware)
// app.use(expressWinston.logger({
//   transports: [
//     new winston.transports.Console()
//   ],
//   meta:false,
//   format: winston.format.combine(
//     winston.format.colorize(),
//     winston.format.json()
//   ),
//   requestWhitelist: ['query','body'],  //these are not included in the standard StackDriver httpRequest
// }))
// Use Routes
app.use("/api/users", users);

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
