import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import jwt from 'jsonwebtoken';
const socketConnection = require('../../utils').socketConnection;
const setAuthToken = require('../../utils').setAuthToken;

const Register = (props) => {
  const state = useSelector((state)=>state)
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    if(state.token !== '') {
      props.history.push({pathname: "/"});    
    }
  },[])

  useEffect(() => {
    // sessionStorage.clear();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("/api/auth/register", {
      username,
      password
    });
    if (res.status === 200) {
      // window.location.replace("/");
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
    }
  };
  
  return (
    <div className="col-md-6 offset-md-3 col-sm-12 register">
            <div className="register_wrapper">
                      <div class="wrapper fadeInDown">
                                  <div id="formContent">
                                          {/* <h2 class="active"> Sign In </h2> */}
                                          <h2 class="active underlineHover">Sign Up </h2>
                                          {/* <div class="fadeIn first">
                                            <img src="http://danielzawadzki.com/codepen/01/icon.svg" id="icon" alt="User Icon" />
                                          </div> */}
                                          <form onSubmit={handleSubmit}>
                                            <input type="text" id="login" class="fadeIn second" name="login" placeholder="username" value={username}  onChange={e => setUsername(e.target.value.toLowerCase())}/>
                                            <input type="text" id="password" class="fadeIn third" name="login" placeholder="password" value={password} onChange={e => setPassword(e.target.value.toLowerCase())}/>
                                            <input type="submit" class="fadeIn fourth" value="Sign up"/>
                                          </form>
                                          <div className="login_wrapper_signup">
                                              <span> Already have a user?</span>
                                              <Button
                                                variant="secondary"
                                                type="submit"
                                                onClick={e => {
                                                  e.preventDefault();
                                                  window.location.replace("/login");
                                                }}
                                                >
                                                Sign in
                                              </Button>
                                        </div>
                                  </div>
                                  {/* <div id="formFooter">
                                    <a class="underlineHover" href="#">Forgot Password?</a>
                                  </div> */}
                      </div>
            </div>

            
      {/* <h1 className="text-center">Sign In</h1> */}
      {/* <form onSubmit={handleSubmit} className="registerForm">
        <input
          placeholder="Enter username"
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
          <Button className="logInButton" type="submit">
            Sign in
          </Button>
          <Button
            variant="secondary"
            type="submit"
            onClick={e => {
              e.preventDefault();
              window.location.replace("/");
            }}
          >
            Login in
          </Button>
        </div>
      </form> */}
    </div>
  );
};

export default Register;
