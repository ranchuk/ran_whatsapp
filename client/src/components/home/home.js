import React, { useState, useEffect } from "react";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Contacts from "../contacts/contacts";
// import AddContact from '../addContact/addContact';
const Home = () => {
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

  // const handleAddContact = async () => {
  //   try {
  //     const res = await axios.post(`/api/users/newContact`, {
  //       username,
  //       contact: newContact
  //     });
  //     if (res.status === 200) {
  //       setNewContactModal(false);
  //       dispatch({ type: "AddContact", payload: res.data });
  //     }
  //   } catch (e) {
  //     setErrorNewContact("User not exist");
  //   }
  // };
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
    <div className="home">
        <Contacts
          setReciever={setReciever}
          setNewContactModal={setNewContactModal}
          setShowEditModal={setShowEditModal}
          setChatInEdit={setChatInEdit}
        />
        <Chat reciever={reciever} showEditModal={showEditModal} setShowEditModal={setShowEditModal} setChatInEdit={setChatInEdit} item={chatInView} />
        {/* <AddContact showNewContactModal={showNewContactModal} setNewContactModal={setNewContactModal} /> */}
 
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

export default Home;
