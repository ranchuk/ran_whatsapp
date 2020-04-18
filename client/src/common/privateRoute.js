import React, {useEffect} from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const socketConnection = require('../utils').socketConnection;
const setAuthToken = require('../utils').setAuthToken;

const PrivateRoute = ({ component: Component, history, ...rest }) => {
  const {token, username} = useSelector((state)=>state);
  // const dispatch = useDispatch();

  // const fetchChats = async () => {
  //   const res = await axios.get(`/api/chats/getChats`);
  //   if(res.data.success){
  //     socketConnection(username, token, dispatch);
  //     dispatch({
  //       type: "Login",
  //       payload: {
  //         username: username,
  //         token: token,
  //         chats: res.data.chats
  //       }
  //     });
  //   }
  // }

  // useEffect(()=>{
  //   if(token !== '') {
  //     setAuthToken(token)
  //     fetchChats();
  //   }
  // },[])

  return <Route
    {...rest}
    render={props =>
      token  ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login"/>
      )
    }
  />
  };

// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired
// };


export default withRouter(PrivateRoute);