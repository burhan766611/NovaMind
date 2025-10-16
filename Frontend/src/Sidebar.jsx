import { useContext, useEffect } from "react";
import "./sidebar.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

const Sidebar = () => {
  const {
    allThreads,
    setAllThreads,
    currentThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrentThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const changeThread = async (newThreadId) => {
    setCurrentThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${id}`, {method: "DELETE"});
      const res = await response.json();
      console.log(res);
      setAllThreads(prev => prev.filter(thread => thread.threadId !== id));

      if(id === currentThreadId){
        createNewChat();
      }
    } catch (err) {
      console.log(err);
      throw(err);
    }
  };

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
      // console.log(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currentThreadId, allThreads]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrentThreadId(uuidv1());
    setPrevChats([]);
  };

  return (
    <>
      <section className="sidebar">
        <button onClick={createNewChat}>
          <img src="src/assets/blacklogo.png" alt="Gpt Logo" className="logo" />
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li 
            key={idx} 
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currentThreadId ? "highlighted" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>By Burhan Sheikh &hearts;</p>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
