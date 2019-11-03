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
  const [showwModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState("");
  const { username } = state;
  const [errorNewContact, setErrorNewContact] = useState("");
  useEffect(() => {
    window.socket.on("clientNewMessage", data => {
      dispatch({ type: "AddMessage", payload: data });
    });
    window.socket.on("clientWriting", data => {
      dispatch({ type: "someoneWriting", payload: data });
    });
  }, []);

  const handleLogOut = () => {
    sessionStorage.clear();

    window.location.href = "/";
  };

  const handleAddContact = async () => {
    try {
      const res = await axios.post(`/api/users/newContact`, {
        username,
        contact: newContact
      });
      if (res.status === 200) {
        setShowModal(false);
        dispatch({ type: "AddContact", payload: res.data });
      }
    } catch (e) {
      setErrorNewContact("User not exist");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 col-sm-12">
      <Button variant="secondary" onClick={handleLogOut}>
        Log out
      </Button>
      <div style={{ display: "flex", marginTop: 50 }}>
        <Contacts setReciever={setReciever} setShowModal={setShowModal} />
        <Chat reciever={reciever} />
      </div>
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
          <span style={{ color: "red" }}>{errorNewContact}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
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
    </div>
  );
};

export default ChatsList;
