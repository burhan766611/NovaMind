import "./chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const Chat = () => {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;

    const content = reply.split(" ");
    var idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  //   return (
  //     <>
  //       {newChat && <h1>Start a New Chat!</h1>}
  //       <div className="chats">
  //         { prevChats?.slice(0, -1).map((chat, idx) => (
  //           <div
  //             className={chat.role === "user" ? "userDiv" : "gptDiv"}
  //             key={idx}
  //           >
  //             {chat.role === "user" ? (
  //               <p className="userMsg">{chat.content}</p>
  //             ) : (
  //               <Markdown rehypePlugins={[rehypeHighlight]}>
  //                 {chat.content}
  //               </Markdown>
  //             )}
  //           </div>
  //         ))}
  //         {prevChats.length > 0 && (
  //           <>
  //             {latestReply === null ? (
  //               <div className="gptDiv" key={"non-typing"}>
  //                 <Markdown rehypePlugins={[rehypeHighlight]}>
  //                   {prevChats[prevChats.length - 1].content}
  //                 </Markdown>
  //               </div>
  //             ) : (
  //               <div className="gptDiv" key={"typing"}>
  //                 <Markdown rehypePlugins={[rehypeHighlight]}>
  //                   {latestReply}
  //                 </Markdown>
  //               </div>
  //             )}
  //           </>
  //         )}
  //         </div>
  //         {/* {prevChats.length > 0 && latestReply !== null && (
  //           <div className="gptDiv" key={"typing"}>
  //             <Markdown rehypePlugins={[rehypeHighlight]}>{latestReply}</Markdown>
  //           </div>
  //         )}
  //         {prevChats.length > 0 && latestReply === null && (
  //           <div className="gptDiv" key={"non-typing"}>
  //             <Markdown rehypePlugins={[rehypeHighlight]}>
  //               {prevChats[prevChats.length - 1].content}
  //             </Markdown>
  //           </div>
  //         )} */}

  //     </>
  //   );
  // };

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}

      <div className="chats">
        {prevChats.map((chat, idx) => {
          // If this is the last message AND typing is active, skip rendering it here
          const isLast = idx === prevChats.length - 1;
          if (isLast && latestReply !== null && chat.role === "assistant")
            return null;

          return (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <p className="userMsg">{chat.content}</p>
              ) : (
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </Markdown>
              )}
            </div>
          );
        })}

        {/* Render the assistant's latest typing message */}
        {latestReply !== null && (
          <div className="gptDiv" key="typing">
            <Markdown rehypePlugins={[rehypeHighlight]}>{latestReply}</Markdown>
          </div>
        )}
      </div>
    </>
  );
};
export default Chat;
