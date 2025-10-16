import "./chatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

const ChatWindow = () => {
  const { prompt, setPrompt, reply, setReply, currentThreadId, setPrevChats, setNewChat } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("message ", prompt, " ThreadId", currentThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currentThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log(res.reply);
      setReply(res.reply);

    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

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

    setPrompt('');
  }, [reply]);

  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            SigmaGPT <i className="fa-solid fa-chevron-down"></i>{" "}
          </span>
          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
        {
          isOpen && (
            <div className="dropDown">
              <div className="dropDownItem">
                <i className="fa-solid fa-gear">  </i>  
                Settings
              </div>
              <div className="dropDownItem">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Upgrade plan
              </div>
              <div className="dropDownItem">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Log out
              </div>
            </div>
          )
        }
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
