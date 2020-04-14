import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import * as _ from 'lodash';
 const AddContact = ({showNewContactModal, setNewContactModal}) => {
    const dispatch = useDispatch();
    const {username} = useSelector(state => state);
    const [query, setQuery] = useState("");
    const [contactsList, setContactsList] = useState([]);
    const [errorNewContact, setErrorNewContact] = useState("");

    const handleAddContact = async () => {
        try {
          const res = await axios.post(`/api/users/newContact`, {
            username,
            contact: query
          });
          if (res.status === 200) {
            setNewContactModal(false);
            dispatch({ type: "AddContact", payload: res.data });
          }
        } catch (e) {
          setErrorNewContact("User not exist");
        }
    };

    const handleInputChange = async (e) => {
        e.preventDefault();
        setQuery(e.target.value);
        const query = e.target.value;
        if(query !== '') {
           debouncedSearch(setContactsList, query);
        }
        else{
            setContactsList([])
        }
    }

    return <Modal show={showNewContactModal} onHide={() => setNewContactModal(false)}>
                    <Modal.Header>
                    <Modal.Title>Add New Contact</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="add_contact_search">
                    <div className="add_contact_search">
                            <InputGroup className="mb-3">
                                <FormControl
                                onChange={handleInputChange}
                                value={query}
                                placeholder="Search User"
                                />
                            </InputGroup>
                            {query && contactsList.map((contact)=>{
                                return <div className="add_contact_search_item" onClick={(e)=>setQuery(contact.username)}>{contact.username}</div>
                            })}
                            <span style={{ color: "red" }}>{errorNewContact}</span>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                        setNewContactModal(false);
                        setErrorNewContact("");
                        setQuery("");
                        setContactsList([])
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
 }

 export default AddContact;


const debouncedSearch = _.debounce(async (setContactsList, query)=>{
        const res = await axios.get(`api/users/searchUser?query=${query}`);
        setContactsList(res.data.results);
},500)
