import React, { useState, useEffect } from "react";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import Contacts from "../contacts/contacts";
import axios from 'axios'

const socketConnection = require('../../utils').socketConnection;
const setAuthToken = require('../../utils').setAuthToken;
const Home = (props) => {
  const dispatch = useDispatch()
  const state = useSelector(state => state);
  const [reciever, setReciever] = useState("");
  const [showChat, setShowChat] = useState(false);
  // const loader = useState(false)

  const { chatInView } = state;

  const fetchChats = async () => {
    const res = await axios.get(`/api/chats/getChats`);
    if(res.data.success){
      socketConnection(state.username, state.token, dispatch);
      dispatch({
        type: "Login",
        payload: {
          username: state.username,
          token: state.token,
          chats: res.data.chats
        }
      });
    }
  }

  useEffect(()=>{
    if(state.token !== '' && !(props.history.location.state && props.history.location.state.isLoggedIn)) {
      console.log('im here')
      setAuthToken(state.token)
      fetchChats();
    }
    props.history.replace();
  },[])
  return (
    <div className="home">
        <Contacts
          setReciever={setReciever}
          showChat={showChat} 
          setShowChat={setShowChat}
        />
        <Chat reciever={reciever} item={chatInView} showChat={showChat} setShowChat={setShowChat}/>
    </div>
  );
};

export default Home;
