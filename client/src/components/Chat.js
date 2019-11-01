import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Chat = ({ reciever }) => {
  const state = useSelector(state => state);
  const [newMessage, setNewMessage] = useState("");
  const { username, socket, chatInView } = state;

  const handleChange = e => {
    setNewMessage(e.target.value);
    const data = {
      time: "",
      sender: state.username,
      reciever: reciever,
      message: e.target.value
    };
    // socket.emit("clientWriting", data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      time: "",
      sender: state.username,
      reciever: reciever,
      message: newMessage
    };
    setNewMessage("");
    socket.emit("clientNewMessage", data);

    // const res = await axios.post("/api/users/addMessage", data);
    // if (res.status === 200) {
    //   console.log("success");
    //   console.log(res.data.chat);
    // }
  };

  const handleDelete = async e => {
    const res = await axios.post(
      `/api/users/chat/delete/${chatInView.username1}/${chatInView.username2}`
    );
    if (res.status === 200) {
      console.log("success");
      console.log(res.data.chat);
    }
  };

  return (
    <div
      id="chat"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflowY: "auto"
      }}
    >
      <div>
        {chatInView.chat.map((item, index) => {
          if (item.sender === username) {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "green",
                  color: "white"
                }}
              >
                {item.message}
              </div>
            );
          } else {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  textAlign: "right"
                }}
              >
                {item.message}
              </div>
            );
          }
        })}
        {chatInView.isClientWriting ? `${reciever} is writing...` : null}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          position: "absolute",
          bottom: 0,
          width: "100%"
        }}
      >
        <input
          placeholder="Enter Your Message..."
          className="form-control"
          onChange={handleChange}
          value={newMessage}
        />
        <button
          className="form-control btn btn-primary"
          style={{ width: "20%" }}
        >
          Send
        </button>
        <button
          className="form-control btn btn-danger"
          style={{ width: "20%" }}
          onClick={handleDelete}
        >
          Delete Messages
        </button>
      </form>
    </div>
  );
};

export default Chat;
