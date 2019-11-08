import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Contacts from "./Contacts";

const ChatsList = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [reciever, setReciever] = useState("");
  const [showNewContactModal, setNewContactModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [chatInEdit, setChatInEdit] = useState("");
  const [newContact, setNewContact] = useState("");
  const { username, chatInView } = state;
  const [errorNewContact, setErrorNewContact] = useState("");
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

  const handleLogOut = async () => {
    sessionStorage.clear();
    // const res = await axios.post(`/api/users/lgout`, {
    //   username
    // });
    //  if (res.status === 200) {
    //    window.location.href = "/";
    //   }
    window.location.href = "/";
  };

  const handleAddContact = async () => {
    try {
      const res = await axios.post(`/api/users/newContact`, {
        username,
        contact: newContact
      });
      if (res.status === 200) {
        setNewContactModal(false);
        dispatch({ type: "AddContact", payload: res.data });
      }
    } catch (e) {
      setErrorNewContact("User not exist");
    }
  };
  const handleDelete = async e => {
    const res = await axios.delete(
      `/api/users/chat/delete/${chatInEdit.username1}/${chatInEdit.username2}`
    );
    if (res.status === 200) {
      const reciever =
        chatInEdit.username1 !== username
          ? chatInEdit.username1
          : chatInEdit.username2;
      dispatch({
        type: "DeleteChat",
        payload: {
          reciever: reciever
        }
      });
      if (chatInEdit._id === chatInView._id) {
        dispatch({
          type: "ChatInView",
          payload: {
            ...chatInView,
            chat: []
          }
        });
      }
    }
    setShowEditModal(false);
  };

  return (
    <div className="col-md-6 offset-md-3 col-sm-12">
      <Button variant="secondary" onClick={handleLogOut}>
        Log out
      </Button>
      <div style={{ display: "flex", marginTop: 50 }}>
        <Contacts
          setReciever={setReciever}
          setNewContactModal={setNewContactModal}
          setShowEditModal={setShowEditModal}
          setChatInEdit={setChatInEdit}
        />
        <Chat reciever={reciever} />
      </div>
      <Modal
        show={showNewContactModal}
        onHide={() => setNewContactModal(false)}
      >
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
          <span style={{ color: "red" }}>{errorNewContact}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setNewContactModal(false);
              setErrorNewContact("");
              setNewContact("");
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleAddContact();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header>
          <Modal.Title>Contact setting</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <button
            className="form-control btn btn-danger"
            onClick={handleDelete}
          >
            Delete All Messages In Chat
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatsList;
