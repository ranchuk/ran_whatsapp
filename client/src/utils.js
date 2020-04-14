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

module.exports = {
    formatAMPM,
    sortByDate
  }
