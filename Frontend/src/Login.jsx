import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

const Login = () => {
  const navigate = useNavigate();
  const {
    setIsLoggedIn,
    setNewChat,
    setPrompt,
    setReply,
    setCurrentThreadId,
    setPrevChats,
    API_BASE
  } = useContext(MyContext);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleDatalogin = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.msg);
        setIsLoggedIn(true);
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrentThreadId(uuidv1());
        setPrevChats([]);
        navigate("/");
      } else {
        console.log(data.msg);
        setLoginData({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginHeader">
          <h1>Welcome Back</h1>
          <p>Log in to your SigmaGPT account</p>
        </div>
        <form onSubmit={handleLoginForm}>
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleDatalogin}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleDatalogin}
              required
            />
          </div>

          <div className="formGroup">
            <button type="submit">Login</button>
          </div>
        </form>

        <div className="switchAuth">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
