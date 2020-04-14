import React, { useState, useEffect, useDebugValue } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Message from '../message/message';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import * as _ from 'lodash';

const debouncedClientWriting = _.debounce((data)=>{
    window.socket.emit("clientWriting", data);
},200)

const Chat = ({ setChatInEdit, setShowEditModal, item }) => {
  const state = useSelector(state => state);
  const [newMessage, setNewMessage] = useState("");
  const { username, chatInView } = state;
  const dispatch = useDispatch();
  const messagesEndRef = React.createRef()

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(()=>{
    scrollToBottom();
  },[chatInView])

  useEffect(()=>{
    //TO DO - GET data of user in chat(pictures and other info needed)

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

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      time: "",
      sender: state.username,
      reciever: chatInView.reciever,
      message: newMessage
    };
    setNewMessage("");
    // console.log(data);
    window.socket.emit("clientNewMessage", data);

    // const res = await axios.post("/api/users/addMessage", data);
    // if (res.status === 200) {
    // }
  };

  // const handleDelete = async e => {
  //   e.preventDefault();
  //   const res = await axios.delete(
  //     `/api/users/chat/delete/${chatInView.username1}/${chatInView.username2}`
  //   );
  //   if (res.status === 200) {
  //     dispatch({
  //       type: "ChatInView",
  //       payload: {
  //         ...chatInView,
  //         chat: []
  //       }
  //     });
  //     dispatch({
  //       type: "DeleteChat",
  //       payload: {
  //         reciever: reciever
  //       }
  //     });
  //   }
  // };

  return (
    <div className="chat">
      <div className="chat_header">
        <span className="chat_header_name">{chatInView.reciever}</span>
        <span className="chat_header_edit"
              onClick={(e) => {
                      setShowEditModal(true);
                      setChatInEdit(item);
              }}
          >
          <EditIcon  className="contactItem_edit_icon"></EditIcon>
        </span>
      </div>
      <div className="chat_messages">
          {Object.keys(chatInView).length === 0 ?  <h1>Please choose contact</h1> : Object.keys(chatInView).length > 0 &&
            chatInView.chat.map((item, index) => {
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
        {/* <button
          className="form-control btn btn-danger"
          style={{ width: "20%" }}
          onClick={handleDelete}
        >
          Delete Messages
        </button> */}
      </form>
    </div>
  );
};

export default Chat;