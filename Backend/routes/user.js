import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import isLogin from "../middleware/Auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
         message: "All fields are required!" }); // 400 Bad Request
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(409) // 409 Conflict
        .json({ success: false, message: "User already exists!" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashPassword,
    });

    await user.save();

    // Send response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });

    // console.log("New user created:", username, email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" }); // 500 for server errors
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Field Required !",
      });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(401).json({
        msg: "Credentials Incorrect !",
        success: false
      });
    }

    const result = await bcrypt.compare(password, userExist.password);

    if (!result) {
      return res.status(401).json({
        msg: "Credentials Incorrect !",
        success: false
      });
    }

    const token = jwt.sign(
      {
        email: userExist.email,
        id: userExist._id,
      },
      process.env.SECRET_KEY
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Logged in Successfully",
      user: userExist,
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
      user: userExist,
      success: true
    });
  }
});

router.get("/verify", isLogin, (req, res) => {
  console.log(req.user);
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.post("/logout", isLogin, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });
  return res.status(200).json({ success: true, message: "Logout successfully" });
});

export default router;
