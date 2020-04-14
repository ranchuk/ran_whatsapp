import React, { useState, useEffect } from "react";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Contacts from "../contacts/contacts";
// import AddContact from '../addContact/addContact';
const Home = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [reciever, setReciever] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const { chatInView } = state;
  useEffect(() => {
    window.socket.on("clientNewMessage", data => {
      dispatch({ type: "AddMessage", payload: data });
    });
    window.socket.on("clientWriting", data => {
      dispatch({ type: "someoneWriting", payload: data });
    });
    window.socket.on("online_status", data => {
      dispatch({ type: "OnlineStatus", payload: data });
    });
  }, []);



  return (
    <div className="home">
        <Contacts
          setReciever={setReciever}
        />
        <Chat reciever={reciever} item={chatInView} />
    </div>
  );
};

export default Home;
