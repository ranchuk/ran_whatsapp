import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import jwt from 'jsonwebtoken';
import io from "socket.io-client";

const setAuthToken = require('../utils').setAuthToken;
const socketConnection = require('../utils').socketConnection;
const Login = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    // submit login credentials
    const res = await axios.post("/api/users/login", {
      username,
      password
    });
    if (res.status === 200) {
      socketConnection(username, res.data.token, dispatch);
      setAuthToken(res.data.token);
      const decoded = jwt.decode(res.data.token);
      dispatch({
        type: "Login",
        payload: {
          username: decoded.username,
          token: res.data.token,
          chats: res.data.chats
        }
      });
      props.history.push("/");    
    };
  };
  return (
    <div className="col-md-6 offset-md-3 col-sm-12">
      <h1 className="text-center" style={{ marginTop: 40 }}>
        Ran-Whatsapp
      </h1>
      <form onSubmit={handleSubmit} className="loginForm">
        <input
          placeholder="Enter username or email address"
          onChange={e => setUsername(e.target.value)}
          value={username}
          className="form-control"
        ></input>
        <input
          placeholder="Enter password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          className="form-control"
        ></input>
        <div className="loginButtons">
          <Button className="logInButton" variant="primary" type="submit">
            Log in
          </Button>
          <Button
            variant="secondary"
            type="submit"
            onClick={e => {
              e.preventDefault();
              window.location.replace("/register");
            }}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
