import React, { useState, useEffect } from "react";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import Contacts from "../contacts/contacts";


const Home = () => {
  const state = useSelector(state => state);
  const [reciever, setReciever] = useState("");
  const [showChat, setShowChat] = useState(false);

  const { chatInView } = state;
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
