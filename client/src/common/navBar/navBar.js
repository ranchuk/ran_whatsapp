import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import Button from "react-bootstrap/Button";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { Portal } from '@material-ui/core';
import AddContact from '../../components/addContact/addContact';
const modalRoot = document.getElementById('modal-root');

const NavBar = () => {
    const [showAddContactModal,setShowAddContactModal] = useState(false);
    const state = useSelector(state => state);
    const { username } = state;

    const handleLogOut = async () => {
        sessionStorage.clear();
        const res = await axios.post(`/api/users/logout`, {
          username
        });
         if (res.status === 200) {
           window.location.href = "/login";
          }
        // window.location.href = "/login";
      };
    return (
            <nav className="nav">
                {/* <span className="center_box"><WhatsAppIcon className="nav_icon"/></span> */}
                                <span className="center_box">
                                    <img className="nav_icon"src={require("../../assets/icon4.png")} width="55px" height="55px" />            
                                </span>

                <div className="nav_links">
                <NavLink to="/register" activeClassName="selectedLink" exact><span className="center_box">Register</span></NavLink>
                <NavLink to="/login" activeClassName="selectedLink" exact><span className="center_box">Log in</span></NavLink>
                <NavLink to="/" activeClassName="selectedLink" exact><span className="center_box">Messages</span></NavLink>
                <span className="center_box" onClick = {(e)=>setShowAddContactModal(!showAddContactModal)}>Find
                </span>
                </div>
                <div className="nav_logout" variant="secondary" onClick={handleLogOut}>
                    <ExitToAppIcon className="nav_logout_icon"/>
                    <span className="nav_logout_text">Logout</span>
                </div>
                {showAddContactModal ? <Portal container={modalRoot}><AddContact showNewContactModal={showAddContactModal} setNewContactModal={setShowAddContactModal}/></Portal> : null}                  
            </nav>
    );
}

export default NavBar;