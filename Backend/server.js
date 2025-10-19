import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js'
import userRoutes from './routes/user.js'
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));


app.use("/api", chatRoutes);
app.use("/user", userRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server runing on ${PORT}`);
    connectDB();
})

app.post("/test", async (req, res) => {

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SigmaGpt}`
        },
        body: JSON.stringify({
            model: 'gpt-5-mini',
            messages: [{
                role: "user",
                content: req.body.message
            }]
        })
    };

    try{
       const response =  await fetch("https://api.openai.com/v1/chat/completions", options)
       const data = await response.json();
       // console.log(data.choices[0].message.content);
       res.send(data.choices[0].message.content);
    } catch(err) {
        console.log(err);
        throw(err);
    }
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database");
    } catch (err){
        console.log("Failed connect with Db ",err);
    }
}

// app.get("/check-cookie", (req, res) => {
//   console.log("Cookies:", req.cookies);
//   res.json(req.cookies);
// });