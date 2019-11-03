import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Chat = ({ reciever }) => {
  const state = useSelector(state => state);
  const [newMessage, setNewMessage] = useState("");
  const { username, chatInView } = state;
  const dispatch = useDispatch();

  const handleChange = e => {
    setNewMessage(e.target.value);
    const data = {
      time: "",
      sender: state.username,
      reciever: chatInView.reciever,
      length: e.target.value.length
    };
    window.socket.emit("clientWriting", data);
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

  const handleDelete = async e => {
    e.preventDefault();
    const res = await axios.delete(
      `/api/users/chat/delete/${chatInView.username1}/${chatInView.username2}`
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
        type: "DeleteChatTemporary",
        payload: {
          reciever: reciever
        }
      });
    }
  };

  return (
    <div
      className="form-control"
      style={{
        height: 500,
        width: 700
      }}
    >
      <div
        id="chat"
        style={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        <div
          style={{
            overflowY: "auto",
            width: "100%",
            height: "100%",
            paddingRight: 10,
            paddingTop: 20
          }}
        >
          {Object.keys(chatInView).length > 0 &&
            chatInView.chat.map((item, index) => {
              if (item.sender === username) {
                return (
                  <div
                    key={index}
                    style={{
                      textAlign: "right",
                      color: "white",
                      marginBottom: 20
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#25D366",
                        borderRadius: 5,
                        minWidth: 100,
                        padding: 10
                      }}
                    >
                      {item.message}
                    </span>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    style={{
                      color: "white",
                      marginBottom: 20
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "lightgrey",
                        borderRadius: 5,
                        minWidth: 100,
                        padding: 10
                      }}
                    >
                      {item.message}
                    </span>
                  </div>
                );
              }
            })}
          {chatInView.isWriting ? `${chatInView.reciever} is writing...` : null}
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
    </div>
  );
};

export default Chat;
