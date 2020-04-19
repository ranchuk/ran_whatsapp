import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ContactItem from '../contactItem/contactItem'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import classnames from 'classnames';
import * as _ from 'lodash';
import MenuIcon from '@material-ui/icons/Menu';
const sortByDate = require('../../utils').sortByDate;
const sortByQuery = require('../../utils').sortByQuery;


const Contacts = ({
  setShowEditModal,
  setReciever,
  setChatInEdit,
  setShowChat,
  showChat
}) => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const { chats: chatList, username, isNavbarOpen } = state;
  const [searchQuery, setSearchQuery] = useState('');


  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }
  let chatListCopy = _.cloneDeep(chatList)
  searchQuery === '' ? sortByDate(chatListCopy) : chatListCopy = sortByQuery(chatListCopy, searchQuery, state.username);

  return (
    <div className={classnames(!showChat ? "contacts" : "contacts_hide")}>
      <div className="contacts_search">
        {/* <span className="contacts_search_burger_menu" onClick={(e)=>dispatch({type: 'OPEN_CLOSE_NAVBAR', payload: !isNavbarOpen})}><MenuIcon/></span> */}
        <span className="contacts_search_burger_menu"> 
          <div className={classnames(isNavbarOpen ? "change" : null, "container")} onClick={()=>{/**setIsBurgerOpen(!isBurgerOpen);**/dispatch({type: 'OPEN_CLOSE_NAVBAR', payload: !isNavbarOpen})}}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>
        </span>
        <div className="contacts_search_input_wrapper"> 
        <input className="contacts_search_input" placeholder="Search contacts" value={searchQuery}  onChange={handleChange}></input>
        <span className="contacts_search_icon"><SearchTwoToneIcon/></span>
        </div>
      </div>
      <div className="contacts_list">
      {chatListCopy &&
        chatListCopy.map((item, index) => {
          const reciever =
            item.username1 !== username ? item.username1 : item.username2;
          const isOnline = item.isOnline ? true : false;
            return <ContactItem key={index} setShowChat={setShowChat} item={item} reciever={reciever} isOnline={isOnline} setReciever={setReciever} setShowEditModal={setShowEditModal} setChatInEdit={setChatInEdit} />
      })}
      </div>
    </div>
  );
};

export default Contacts;
