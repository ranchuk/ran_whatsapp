import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const ChatsList = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [reciever, setReciever] = useState("");
  const { chats: chatList, username, chatInView } = state;

  useEffect(() => {
    window.socket.on("clientNewMessage", data => {
      dispatch({ type: "AddMessage", payload: data });
    });
    window.socket.on("clientWriting", data => {
      console.log(data);
      dispatch({ type: "someoneWriting", payload: data });
    });
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("persist:root");
    window.location.href = "/";
  };

  const handleAddContact = async contact => {
    const res = await axios.post("/api/users/newContact", {
      username,
      contact: "adva"
    });
    if (res.status === 200) {
      console.log(res.data);
      // dispatch({})
      // window.location.replace("/");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 col-sm-12">
      <button onClick={handleLogOut}>Log out</button>
      <button onClick={handleAddContact}>Add Contact</button>
      <h1>Ran-Whatsapp</h1>
      <div style={{ display: "flex", marginTop: 50 }}>
        <div
          className="form-control"
          style={{
            height: 500,
            width: 200
          }}
        >
          {chatList &&
            chatList.map((item, index) => {
              const reciever =
                item.username1 !== username ? item.username1 : item.username2;
              return (
                <div
                  className="chatItem"
                  style={{
                    cursor: "pointer",
                    borderBottom: 1,
                    borderBottomColor: "black",
                    borderBottomStyle: "solid"
                  }}
                  key={index}
                  onClick={e => {
                    dispatch({
                      type: "ChatInView",
                      payload: { ...item, reciever }
                    });
                    setReciever(reciever);
                  }}
                >
                  <span>{reciever}</span>
                </div>
              );
            })}
        </div>
        <div
          className="form-control"
          style={{
            height: 500,
            width: 700
          }}
        >
          {Object.keys(chatInView).length > 0 ? (
            <Chat reciever={reciever} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatsList;
