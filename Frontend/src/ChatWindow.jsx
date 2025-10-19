import "./chatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const ChatWindow = () => {
  let navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId,
    setPrevChats,
    setNewChat,
    isloggedIn,
    setIsLoggedIn,
    API_BASE
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("message ", prompt, " ThreadId", currentThreadId);
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currentThreadId,
      }),
    };
    if(!isloggedIn ){
        navigate("/login")
      }

    try {
      const response = await fetch(`${API_BASE}/api/chat`, options);
      const res = await response.json();
      if(res.success){
        console.log(res.reply);
        setReply(res.reply);
      } else{
        console.log(res.message);
      }
      
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

const handleLogout = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/logout`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    const msg = await response.json();
    console.log(msg);
    setIsLoggedIn(false);
  } catch (err) {
    console.log(err);
  }
  
};


  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            SigmaGPT <i className="fa-solid fa-chevron-down"></i>{" "}
          </span>
          <div className="userIconDiv">
            <span className="userIcon">
              {isloggedIn ? (
                <i className="fa-solid fa-user" onClick={handleProfileClick}>
                  {" "}
                </i>
              ) : (
                <i
                  className="fa-solid fa-user-plus"
                  onClick={handleProfileClick}
                ></i>
              )}
            </span>
          </div>
        </div>
        {isOpen &&
          (isloggedIn ? (
            <div className="dropDown">
              <div className="dropDownItem">
                <i className="fa-solid fa-gear"> </i>
                Settings
              </div>
              <div className="dropDownItem">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Upgrade plan
              </div>
              <div className="dropDownItem" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Log out
              </div>
            </div>
          ) : (
            <div className="dropDown">
              <div className="dropDownItem" onClick={() => navigate("/login")}>
                <i className="fa-solid fa-unlock-keyhole"></i>
                Login
              </div>
              <div className="dropDownItem" onClick={() => navigate("/signup")}>
                <i className="fa-solid fa-key"></i>
                Sign up
              </div>
            </div>
          ))}
        <Chat />
        <ScaleLoader color="#fff" loading={loading} />
        <div className="chatInput">
          <div className="inputBox">
            <input
              type="text"
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            />
            <div id="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <p className="info">
            SigmaGpt can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
