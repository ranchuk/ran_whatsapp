import React, { useState, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import classnames from 'classnames';
const formatAMPM = require('../../utils').formatAMPM;

const ContactItem = ({item, isOnline, reciever, setReciever}) => {
  const dispatch = useDispatch()

  const lastMessageDate = item.chat[item.chat.length - 1] && item.chat[item.chat.length - 1].time ? formatAMPM(new Date(item.chat[item.chat.length - 1].time)) : null
  const lastMessage = item.chat[item.chat.length - 1] && item.chat[item.chat.length - 1].message;
  return <div className="contactItem"                     
              onClick={e => {
                dispatch({
                  type: "ChatInView",
                  payload: { ...item, reciever }
                });
                setReciever(reciever);
              }}>
                  <div className="contactItem_image">
                    <img className="contactItem_image" src={require("../../assets/img_avatar.png")} alt="Avatar" style={{width:"50px"}}/>
                    <span className={classnames(isOnline ? 'contactItem_image_isOnline' : 'contactItem_image_isOffline')}></span>
                  </div>
                  <div className="contactItem_name">
                    <div className="contactItem_name_time">
                      <span className="contactItem_name_time_name"> {reciever}</span>
                      <span className="contactItem_name_time_time"> {lastMessageDate}</span>
                    </div>
                    <span className="contactItem_name_message">{lastMessage}</span>
                  </div>
        </div>
};

export default ContactItem;
