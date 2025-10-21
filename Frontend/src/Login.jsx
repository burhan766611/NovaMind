import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    setIsLoggedIn,
    setNewChat,
    setPrompt,
    setReply,
    setCurrentThreadId,
    setPrevChats,
    API,
  } = useContext(MyContext);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleDatalogin = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginForm = async (e) => {
    if(loading) return;
    setLoading(true);

    e.preventDefault();
    try {
      // const response = await fetch(`${API_BASE}/user/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify(loginData),
      // });

      const response = await API.post(`/user/login`, loginData);
      const data = await response.data;
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginHeader">
          <h1>Welcome Back</h1>
          <p>Log in to your NovaMind account</p>
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
            <button type="submit" disabled={loading}>
              {/* Login */}
              {loading ? "Processing..." : "Submit"}
            </button>
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
