import "./App.css";
import { MyContext } from "./MyContext";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Home from "./Home";
import Login from "./Login";
import API from "../services/api"

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState([]);
  const [allThreads, setAllThreads] = useState([]);
  const [isloggedIn, setIsLoggedIn] = useState();

  const API_BASE = import.meta.env.VITE_API_URL;
  
  const providervalue = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId,
    setCurrentThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    isloggedIn,
    setIsLoggedIn,
    API,
    API_BASE
  };


  useEffect(() => {
    const checkLogin = async () => {
    try {
      const response = await API.get("/user/verify");
      const data = await response.data;

      if (data.success) {
        console.log("Logged in:", data.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.log("Not logged in", err);
      setIsLoggedIn(false);
    }
  };

  checkLogin();
  }, [])

  return (
    <>
      <div className="app">
        <MyContext.Provider value={providervalue}>
          <BrowserRouter>
            {/* <Sidebar />
            <ChatWindow /> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </MyContext.Provider>
      </div>
    </>
  );
}

export default App;
