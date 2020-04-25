import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from 'classnames';
import axios from 'axios';
const formatAMPM = require('../../utils').formatAMPM;

const ContactItem = ({item, isOnline, reciever, setReciever,setShowChat}) => {
  const dispatch = useDispatch()
  const {chatInView} = useSelector((state) => state)
  const {username} = useSelector((state) => state)
  const unReadMessages = chatInView._id !== item._id && item.chat.reduce((prevValue,item)=>item.reciever === username && !item.isRead ? prevValue + 1 : prevValue,0)
  const lastMessageDate = item.chat[item.chat.length - 1] && item.chat[item.chat.length - 1].time ? formatAMPM(new Date(item.chat[item.chat.length - 1].time)) : null
  const lastMessage = item.chat[item.chat.length - 1] && item.chat[item.chat.length - 1].message;

  const updateIsRead = () => {
    // console.log(item)
    if(item.chat[item.chat.length -1].reciever === username && !item.chat[item.chat.length -1].isRead){
      axios.put("/api/chats/messagesReadUpdate", {_id: item._id})
    }
  }
  return <div className="contactItem"                     
              onClick={e => {
                dispatch({
                  type: "OPEN_CLOSE_NAVBAR",
                  payload: false
                });
                dispatch({
                  type: "ChatInView",
                  payload: { ...item, reciever }
                });
                setReciever(reciever);
                setShowChat(true);
                updateIsRead()
              }}>
                  <div className="contactItem_image">
                    <img className="contactItem_image" src={require("../../assets/img_avatar.png")} alt="Avatar" style={{width:"50px"}}/>
                    <span className={classnames(isOnline ? 'contactItem_image_isOnline' : 'contactItem_image_isOffline')}></span>
                  </div>
                  <div className="contactItem_name">
                    <div className="contactItem_name_time">
                      <span className="contactItem_name_time_name"> {reciever}</span>
                      <span className="contactItem_name_time_time"> {lastMessageDate}</span>
                      {unReadMessages ? <span className="contactItem_name_time_notification">{unReadMessages}</span> : null}
                    </div>
                    <span className="contactItem_name_message">{lastMessage}</span>
                  </div>
        </div>
};

export default ContactItem;
