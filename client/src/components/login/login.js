import React, { useState, useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import jwt from 'jsonwebtoken';
import io from "socket.io-client";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
const setAuthToken = require('../../utils').setAuthToken;
const socketConnection = require('../../utils').socketConnection;

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  label: 'loginForm_input'
}));

const Login = props => {
  const state = useSelector((state)=>state)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    // submit login credentials
    const res = await axios.post("/api/auth/login", {
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
      props.history.push({pathname: "/", state: {isLoggedIn: true}});    
    };
  };



  useEffect(()=>{
    if(state.token !== '') {
      props.history.push({pathname: "/"});    
    }
  },[])
  
  return (
    <div className="col-md-6 offset-md-3 col-sm-12 login">
      <div className="login_wrapper">
                <div class="wrapper fadeInDown">
                       <div id="formContent">
                              <h2 class="active"> Sign In </h2>
                              {/* <h2 class="inactive underlineHover">Sign Up </h2> */}
                              {/* <div class="fadeIn first">
                                <img src="http://danielzawadzki.com/codepen/01/icon.svg" id="icon" alt="User Icon" />
                              </div> */}
                              <form onSubmit={handleSubmit}>
                                <input type="text" id="login" class="fadeIn second" name="login" placeholder="username"  onChange={e => setUsername(e.target.value)}/>
                                <input type="text" id="password" class="fadeIn third" name="login" placeholder="password" onChange={e => setPassword(e.target.value)}/>
                                <input type="submit" class="fadeIn fourth" value="Sign in"/>
                              </form>

                              <div className="login_wrapper_signup">
                                  <span> Don't have a user?</span>
                                  <Button
                                    variant="secondary"
                                    type="submit"
                                    onClick={e => {
                                      e.preventDefault();
                                      window.location.replace("/register");
                                    }}
                                    >
                                    Sign up
                                  </Button>
                              </div>

                      </div>
                      {/* <div id="formFooter">
                        <a class="underlineHover" href="#">Forgot Password?</a>
                      </div> */}
                </div>
        </div>

        {/* <h1>
        Log in
      </h1> */}
          {/* <form onSubmit={handleSubmit} className={"login_form"}> 
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
          </form> */}
    </div>
  );
};

export default Login;