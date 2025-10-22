import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import "./signup.css";
import API from "../services/API";

const SignUp = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleDataSignUp = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if(loading) return;
    setLoading(true)
    
    try {
      // const response = await fetch(`${API_BASE}/user/signup`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify(signUpData),
      // });
      const response = await API.post("/user/signup", signUpData);
      const data = await response.data;
      if (data.success) { 
        setSignUpData({
          username: "",
          email: "",
          password: "",
        });
        console.log(data.message);
        navigate("/login");
      } else {
        setSignUpData({
          username: "",
          email: "",
          password: "",
        });
        console.log(data.message)
      }
      // setSignUpData({
      //   username: "",
      //   email: "",
      //   password: "",
      // });
      // navigate("/login")
    } catch (err) {
      setSignUpData({
          username: "",
          email: "",
          password: "",
        });
      console.log(err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="signupContainer">
      <div className="signupCard">
        <div className="signupHeader">
          <h1>Welcome to NovaMind</h1>
          <p>Create your account to get started</p>
        </div>
        <form onSubmit={handleForm}>
          <div className="formGroup">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={signUpData.username}
              onChange={handleDataSignUp}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signUpData.email}
              onChange={handleDataSignUp}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={signUpData.password}
              onChange={handleDataSignUp}
            />
          </div>

          <div className="formGroup">
            <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Sign up"}
              </button>
          </div>
        </form>

        <div className="switchAuth">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
