import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("/api/auth/register", {
      username,
      password
    });
    if (res.status === 200) {
      window.location.replace("/");
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
                                            <input type="text" id="login" class="fadeIn second" name="login" placeholder="username"  onChange={e => setUsername(e.target.value)}/>
                                            <input type="text" id="password" class="fadeIn third" name="login" placeholder="password" onChange={e => setPassword(e.target.value)}/>
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
