
const axios =  require('axios');
const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const setAuthToken = token => {
  if (token) {
    //Apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
}
const sortByDate = (myArray) => {
    myArray.sort(function compare(itemA, itemB) {
        if(itemA.chat.length > 0 && itemB.chat.length > 0){
            var dateA = new Date(itemA.chat[itemA.chat.length - 1].time);
            var dateB = new Date(itemB.chat[itemB.chat.length - 1].time);
            return dateB - dateA;
        }
        else if (itemA.chat.length === 0) return dateB
        else if (itemB.chat.length === 0) return dateA
    });
};
const sortByQuery = (myArray, query, username) => {
  return myArray.filter((item) => {
      return (item.username1 !== username && item.username1.includes(query)) || (item.username2 !== username && item.username2.includes(query))
  });
};

const socketConnection = (username, token, dispatch) => {
  window.socket = io.connect("/",  { query: {token}})
  window.socket.on('connect', function() {
        if (window.socket.connected) {
              window.socket.on("clientNewMessage", data => {
                dispatch({ type: "AddMessage", payload: data });
              });
              window.socket.on("clientWriting", data => {
                dispatch({ type: "someoneWriting", payload: data });
              });
              window.socket.on("online_status", data => {
                dispatch({ type: "OnlineStatus", payload: data });
              });
                window.socket.emit("join", { username });
        } 
  })
}

module.exports = {
    formatAMPM,
    sortByDate,
    setAuthToken,
    socketConnection,
    sortByQuery,
}
