import React, {useState} from 'react'
import { NavLink, withRouter } from 'react-router-dom'
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
  const dispatch = useDispatch();
    const [showAddContactModal,setShowAddContactModal] = useState(false);
    const state = useSelector(state => state);
    const { username, isNavbarOpen } = state;
    const handleLogOut = async () => {
        sessionStorage.clear();
        const res = await axios.post(`/api/auth/logout`, {
          username
        });
        dispatch({type: 'Logout'});
        sessionStorage.removeItem('persist:root');
        window.location.href = "/login";

        //  if (res.status === 200) {
        //    window.location.href = "/login";
        //   }
      };

    const showForNotLoggedIn = () => {
      return <>
                <NavLink to="/register" activeClassName="selectedLink" exact>
                  <div className="icon_text">
                    <span className="icon"><ChatBubbleOutlineIcon fontSize="inherit"/></span>
                    <span className="text">Register</span>
                  </div>
                </NavLink> 
                <NavLink to="/login" activeClassName="selectedLink" exact>
                  <div className="icon_text">
                      <span className="icon"><LockOpenIcon fontSize="inherit"/></span>
                      <span className="text">Log in</span>
                  </div>
              </NavLink>
            </>
    }
    const showForLoggedIn = () => {
      return <>
                <NavLink to="/" exact>
                <div className="icon_text" onClick = {(e)=>setShowAddContactModal(!showAddContactModal)}>
                  <span className="icon"><GroupAddIcon fontSize="inherit"/></span>
                  <span className="text">Find</span>
                </div>
              </NavLink>
                <NavLink to="/" activeClassName="selectedLink" exact>
                      <div className="icon_text">
                        <span className="icon"><ChatBubbleOutlineIcon fontSize="inherit"/></span>
                        <span className="text">Messages</span>
                      </div>
                </NavLink>
                <NavLink to="/" exact className="nav_links_logout">
                    <div className="icon_text" onClick={handleLogOut}>
                        <span className="icon"><ExitToAppIcon/></span>
                        <span className="text">Logout</span>
                    </div>
                </NavLink>
              </>
    }
    return (
            <nav className={classnames("nav", !isNavbarOpen ? "nav_hidden" : null)}>
                              {/*<span className="center_box"><WhatsAppIcon className="nav_icon"/></span>}\
                                 <span className="center_box">
                                    <img className="nav_icon"src={require("../../assets/icon4.png")} width="55px" height="55px" />            
                                </span> */}

                <div className="nav_links" onClick={()=>dispatch({type: 'OPEN_CLOSE_NAVBAR', payload: !isNavbarOpen})}>
                {username === '' ? showForNotLoggedIn(): showForLoggedIn()}
                </div>
                {showAddContactModal ? <Portal container={modalRoot}><AddContact showNewContactModal={showAddContactModal} setNewContactModal={setShowAddContactModal}/></Portal> : null}                  
            </nav>
    );
}

export default withRouter(NavBar);