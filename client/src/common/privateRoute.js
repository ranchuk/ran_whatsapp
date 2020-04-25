import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, history, ...rest }) => {
  const {token} = useSelector((state)=>state);

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

export default withRouter(PrivateRoute);