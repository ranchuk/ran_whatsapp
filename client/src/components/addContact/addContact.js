import React, { useState } from "react";
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
              if(res.data.message !== 'success'){
                setErrorNewContact(res.data.message);
              }
              else{
                    setNewContactModal(false);
                    dispatch({ type: "AddContact", payload: res.data.newChat });
              }
          }
        } catch (e) {
          setErrorNewContact('Something went wrong');
        }
    };

    const handleInputChange = async (e) => {
        e.preventDefault();
        setQuery(e.target.value);
        setErrorNewContact('');
        const query = e.target.value;
        if(query !== '') {
           debouncedSearch(setContactsList,setErrorNewContact, query);
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
                            {query && contactsList.map((username, index)=>{
                                return <div key={index} className="add_contact_search_item" onClick={(e)=>setQuery(username)}>{username}</div>
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


const debouncedSearch = _.debounce(async (setContactsList,setErrorNewContact, query)=>{
        const res = await axios.get(`api/users/searchUser?query=${query}`);
        if (res.status === 200) {
            if(res.data.message !== 'success'){
              setErrorNewContact(res.data.message);
            }
            else{
                setContactsList(res.data.results);
            }
        } 
        else {
            setErrorNewContact('Something went wrong');
        }
},500)
