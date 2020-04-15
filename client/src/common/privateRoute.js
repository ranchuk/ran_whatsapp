import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const socketConnection = require('../utils').socketConnection;
const setAuthToken = require('../utils').setAuthToken;

const PrivateRoute = ({ component: Component, history, ...rest }) => {
  const {token, username} = useSelector((state)=>state);
  const dispatch = useDispatch();

  //TO DO  get token. if exist, send to login api to retrieve new data
  return <Route
    {...rest}
    render={props =>
      token && username  ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
  };

// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired
// };


export default withRouter(PrivateRoute);