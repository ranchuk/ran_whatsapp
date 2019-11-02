import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

const ChatsList = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [reciever, setReciever] = useState("");
  const [showwModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState("");
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

  const handleAddContact = async () => {
    const res = await axios.post(`/api/users/newContact`, {
      username,
      contact: newContact
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
      <button onClick={() => setShowModal(true)}>Add Contact</button>
      <Modal show={showwModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Add New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              onChange={e => {
                setNewContact(e.target.value);
              }}
              value={newContact}
              placeholder="Contact Name..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleAddContact();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
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
