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
    const res = await axios.post("/api/users/register", {
      username,
      password
    });
    if (res.status === 200) {
      window.location.replace("/");
    }
  };
  return (
    <div className="col-md-6 offset-md-3 col-sm-12">
      <h1 className="text-center">Sign In</h1>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
};

export default Register;
