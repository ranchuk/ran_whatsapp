import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Message from '../message/message';
import SendIcon from '@material-ui/icons/Send';
// import EditIcon from '@material-ui/icons/Edit';
import { Portal } from '@material-ui/core';
import Modal from "react-bootstrap/Modal";
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import classnames from 'classnames';

import * as _ from 'lodash';

const debouncedClientWriting = _.debounce((data)=>{
    window.socket.emit("clientWriting", data);
},200)

const Chat = ({ item, setShowChat, showChat }) => {
  const state = useSelector(state => state);
  const [newMessage, setNewMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  // handleShowChat
  const { username, chatInView } = state;
  const dispatch = useDispatch();
  const messagesEndRef = React.createRef()

  // useEffect(()=>{
  //   if(chatInView.chat && chatInView.chat.length > 0){
  //     if(chatInView.chat[chatInView.chat.length-1].reciever === state.username){
  //       dispatch({type: "updateChatInViewReadStatus"})
  //       axios.put("/api/chats/messagesReadUpdate", {_id: item._id})
  //       .then((res)=>{
  //         console.log(res)
  //       })
  //       .catch((err)=>{
  //         console.log(err)
  //       })
  //     }
  //   }
  // },[chatInView.chat])

  useEffect(()=>{
    Object.keys(chatInView).length !== 0 && messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  },[chatInView, messagesEndRef])

  useEffect(()=>{
    //TO DO - GET data of user in chat(pictures and other info needed)
    if(item.chat && item.chat[item.chat.length -1].reciever === username && !item.chat[item.chat.length -1].isRead){
      axios.put("/api/chats/messagesReadUpdate", {_id: item._id})
    }
  },[chatInView])
  const handleChange = e => {
    setNewMessage(e.target.value);
    const data = {
      time: "",
      sender: state.username,
      reciever: chatInView.reciever,
      length: e.target.value.length
    };
    debouncedClientWriting(data)
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      time: "",
      sender: state.username,
      reciever: chatInView.reciever,
      message: newMessage
    };
    setNewMessage("");
    if(newMessage.toString().trim() !== ''){
      window.socket.emit("clientNewMessage", data);
    }
  };
  const handleDelete = async e => {
    const res = await axios.delete(
      `/api/chats/delete/${chatInView.username1}/${chatInView.username2}`
    );
    if (res.status === 200) {
        dispatch({
          type: "ChatInView",
          payload: {
            ...chatInView,
            chat: []
          }
        });
        dispatch({
          type: "DeleteChat",
          payload: {
            reciever: chatInView.username1 !== username ? chatInView.username1 : chatInView.username2
          }
        });
    }
    setShowEditModal(false);
  };
  return Object.keys(chatInView).length === 0  ? null  : 
  <div className={classnames(showChat ? "chat" : "chat_hide")} onClick={()=>{}/**dispatch({type: "OPEN_CLOSE_NAVBAR", payload: false})**/}>
        <div className="chat_header">
          <div className="chat_header_back">
            <ArrowBackIcon onClick={(e)=>setShowChat(false)} />
          </div>
          <div className="chat_header_image_name">
              <div className="contactItem_image">
                    <img className="contactItem_image" src={require("../../assets/img_avatar.png")} alt="Avatar" style={{width:"50px"}}/>
                    <span className={classnames(chatInView.isOnline ? 'contactItem_image_isOnline' : 'contactItem_image_isOffline')}></span>
              </div>
              <span className="chat_header_name">{chatInView.reciever}</span>
          </div>
          <span className="chat_header_edit"
                onClick={(e) => {
                        setShowEditModal(true);
                }}
            >
            <DeleteIcon className="contactItem_edit_icon"></DeleteIcon>
          </span>
      </div>
      <div className="chat_messages">
          {chatInView.chat.map((item, index) => {
              return <Message key={index} item={item} username={username}/>
            })}

          {chatInView.isWriting ?  <Message loader/> : null}
          <div ref={messagesEndRef} />
      </div>
      <form
        className="chat_input_wrapper"
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Type something..."
          className="chat_input_input"
          onChange={handleChange}
          value={newMessage}
        />
        <span
          className="chat_input_button"
          onClick={(e) => handleSubmit(e)}
        >
          <SendIcon  className="chat_input_button_arrow"></SendIcon>
        </span>
      </form>
      <Portal><Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header>
            <Modal.Title>Are you sure you want to delete this chat?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <button
              className="form-control btn btn-danger"
              onClick={handleDelete}
            >
              Delete all messages in this chat
            </button>
          </Modal.Body>
        </Modal>
      </Portal>
      </div>
};

export default Chat;