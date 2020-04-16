import React, {useState} from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import Button from "react-bootstrap/Button";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { Portal } from '@material-ui/core';
import AddContact from '../../components/addContact/addContact';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import classnames from 'classnames';
const modalRoot = document.getElementById('modal-root');
const NavBar = ({history}) => {
    const [showAddContactModal,setShowAddContactModal] = useState(false);
    const state = useSelector(state => state);
    const { username, isNavbarOpen } = state;
    const currentPath = history.location.pathname;
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
            <nav className={classnames(isNavbarOpen ? "nav" : "nav_hidden")}>
                              {/*<span className="center_box"><WhatsAppIcon className="nav_icon"/></span>}\
                                 <span className="center_box">
                                    <img className="nav_icon"src={require("../../assets/icon4.png")} width="55px" height="55px" />            
                                </span> */}

                <div className="nav_links">
                  <NavLink to="/register" activeClassName="selectedLink" exact>
                      <div className="icon_text">
                          <span className="icon"><ChatBubbleOutlineIcon/></span>
                          <span className="text">Register</span>
                      </div>
                  </NavLink>
                  <NavLink to="/login" activeClassName="selectedLink" exact>
                        <div className="icon_text">
                            <span className="icon"><LockOpenIcon/></span>
                            <span className="text">Log in</span>
                        </div>
                    </NavLink>
                    <NavLink to="/" activeClassName="selectedLink" exact>
                        <div className="icon_text">
                          <span className="icon"><ChatBubbleOutlineIcon/></span>
                          <span className="text">Messages</span>
                        </div>
                    </NavLink> 
                {username !== '' && 
                    <NavLink to="/" exact>
                        <div className="icon_text" onClick = {(e)=>setShowAddContactModal(!showAddContactModal)}>
                          <span className="icon"><GroupAddIcon/></span>
                          <span className="text">Find</span>
                        </div>
                    </NavLink>
                }
                  <NavLink to="/" exact className="nav_links_logout">
                      <div className="icon_text" onClick={handleLogOut}>
                          <span className="icon"><ExitToAppIcon/></span>
                          <span className="text">Logout</span>
                      </div>
                  </NavLink>
                </div>
                {showAddContactModal ? <Portal container={modalRoot}><AddContact showNewContactModal={showAddContactModal} setNewContactModal={setShowAddContactModal}/></Portal> : null}                  
            </nav>
    );
}

export default withRouter(NavBar);