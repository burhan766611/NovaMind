import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import isLogin from "../middleware/Auth.js";
import status from "http-status";
import User from "../models/User.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abcd",
      title: "Testing",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to save in DB",
    });
  }
});

router.get("/thread",isLogin, async (req, res) => {
  try {
    const token = req.user;

    const user = await User.findOne({ email: req.user.email }).populate({
      path: "thread",
      options: { sort: { updatedAt: -1 } }, // sort during population
    });

    res.json(user.thread);

    // const thread = await Thread.find().sort({ updatedAt: -1 });
    // res.json(thread);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", isLogin, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status().json({
        error: "Thread Not Found",
      });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", isLogin, async (req, res) => {
  const { threadId } = req.params;

  const deletedThread = await Thread.findOneAndDelete({ threadId });

  if (!deletedThread) {
    res.status(404).json({
      error: "Thread Not Found",
    });
  }

  res.status(200).json({
    success: "Thread Deleted Successfully",
  });

  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
});
router.post("/chat", isLogin, async (req, res) => {
  const user = req.user;
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ 
      success: false,
      error: "Missing required fields" 
    });
  }

  try {
    let thread = await Thread.findOne({ threadId });
    const existingUser = await User.findOne({ email: user.email });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    // link thread to user if not already linked
    const threadExists = existingUser.thread.some(
      (t) => t.toString() === thread._id.toString()
    );

    if (!threadExists) {
      existingUser.thread.push(thread._id);
      await existingUser.save();
    }

    res.json({ reply: assistantReply, success: true, });
  } catch (err) {
    console.error("Error in /chat route:", err);
    res.status(500).json({success: false, error: "Something went wrong" });
  }
});

// router.post("/chat", isLogin, async (req, res) => {
//   const user = req.user;
//   const { threadId, message } = req.body;

//   if (!threadId || !message) {
//     res.status(400).json({
//       error: "Missing required fields",
//     });
//   }

//   try {
//     let thread = await Thread.findOne({ threadId });
//     const existingUser = await User.findOne({ email: user.email });

//     if (!thread) {
//       thread = new Thread({
//         threadId,
//         title: message,
//         messages: [
//           {
//             role: "user",
//             content: message,
//           },
//         ],
//       });
//     } else {
//       thread.messages.push({
//         role: "user",
//         content: message,
//       });
//     }

//     const assistantReply = await getOpenAIAPIResponse(message);

//     thread.messages.push({
//       role: "assistant",
//       content: assistantReply,
//     });
//     thread.updatedAt = new Date();
//     await thread.save();

//     const allThreadUser = await User.findOne({
//       email: user.email,
//     }).populate("thread");
//     existingUser.thread.push(thread);
//     await existingUser.save();

//     let c = 0;
//     allThreadUser.thread.map((e) => {

//         if(e._id === thread._id){
//             c++;
//             console.log(c)
//         }
//     })
//     console.log("c value last : ",c);

//     if( c === 0) {
//         existingUser.thread.push(thread);
//         await existingUser.save();
//     }

//     res.json({
//       reply: assistantReply,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: "Something went wrong",
//     });
//   }
// });

export default router;
