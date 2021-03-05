const mongoose = require("mongoose");
const db = require("./keys/keys").mongoURI;

const connectDB = async (cb) => {
    return mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    },() => {
      console.log('connected to DB')
      cb();
    //     return mongoose.connect('mongodb://mongo:27017/ran-chat-app-server', {
    //   useNewUrlParser: true,
    //   useCreateIndex: true
    // },() => {
    //   console.log('connected to DB')
    //   cb();
    });
};
module.exports = connectDB;
