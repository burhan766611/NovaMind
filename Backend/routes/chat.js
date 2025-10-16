import express from 'express'
import Thread from '../models/Thread.js';
import getOpenAIAPIResponse from '../utils/openai.js';

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: 'abcd',
            title: "Testing"
        });
        const response = await thread.save();
        res.send(response);
    } catch (err){
        console.log(err);
        res.status(500).json({
            error: "Failed to save in DB"
        });
    }
})

router.get("/thread", async (req, res) => {
    try{
        const thread = await Thread.find({}).sort({updatedAt: -1});
        res.json(thread);
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const {threadId } = req.params;

    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
            return res.status().json({
                error: "Thread Not Found"
            })
        }

        res.json(thread.messages);

    } catch(err){
        console.log(err)
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {

    const {threadId }= req.params;

    const deletedThread = await Thread.findOneAndDelete({threadId});

    if(!deletedThread){
        res.status(404).json({
            error: "Thread Not Found"
        })
    }

    res.status(200).json({
        success: "Thread Deleted Successfully"
    })

    try{

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to delete thread"
        })
    }
});

router.post("/chat", async (req, res) => {

    const {threadId, message} = req.body;

    if(!threadId && !message){
        res.status(400).json({
            error: "Missing required fields"
        })
    }

    try {
        let thread = await Thread.findOne({threadId})

        if(!thread){
            thread = new Thread({
                threadId,
                title: message,
                messages: [{
                    role: "user",
                    content: message
                }]
            })
        } else{
            thread.messages.push({
                role: 'user',
                content: message
            });
        }

        const assistantReply = await getOpenAIAPIResponse(message)

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });
        thread.updatedAt = new Date();
        await thread.save();

        res.json({
            reply: assistantReply
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Something went wrong"
        })
    }
});

export default router;