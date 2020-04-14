import React from "react";
import { useSelector } from "react-redux";
import ContactItem from '../contactItem/contactItem'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import * as _ from 'lodash';
const sortByDate = require('../../utils').sortByDate;

const Contacts = ({
  setShowEditModal,
  setReciever,
  setChatInEdit
}) => {
  const state = useSelector(state => state);
  const { chats: chatList, username } = state;

  let chatListCopy = _.cloneDeep(chatList)
  sortByDate(chatListCopy)

  return (
    <div className="contacts">
      <div className="contacts_search">
        <div className="contacts_search_input_wrraper"> 
        <input className="contacts_search_input" placeholder="Search messages"></input>
        <span className="contacts_search_icon"><SearchTwoToneIcon/></span>
        </div>
      </div>
      <div className="contacts_list">
      {chatListCopy &&
        chatListCopy.map((item, index) => {
          const reciever =
            item.username1 !== username ? item.username1 : item.username2;
          const isOnline = item.isOnline ? true : false;
            return <ContactItem key={index} item={item} reciever={reciever} isOnline={isOnline} setReciever={setReciever} setShowEditModal={setShowEditModal} setChatInEdit={setChatInEdit} />
      })}
      </div>
    </div>
  );
};

export default Contacts;
