import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const {username} = useSelector((state)=>state);
  //TO DO  get token. if exist, send to login api to retrieve new data
  return <Route
    {...rest}
    render={props =>
      username !== '' ? (
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


export default PrivateRoute;