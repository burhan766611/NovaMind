import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import status from "http-status";
import jwt from "jsonwebtoken";
import "dotenv/config";
import isLogin from "../middleware/Auth.js";

const router = express.Router();


router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(status.UNAUTHORIZED).json({ message: "Field Required!" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res
      .status(status.ALREADY_REPORTED)
      .json({ message: "User Already Exist !" });
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    email,
    password: hashPassword,
  });

  await user.save();

  res.status(status.CREATED).json({
    message: "User Created",
    user: user,
  });

  console.log(username, email, password);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(status.NOT_FOUND).json({
        msg: "Field Required !",
      });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(status.NOT_FOUND).json({
        msg: "Credentials Incorrect !",
        success: false
      });
    }

    const result = await bcrypt.compare(password, userExist.password);

    if (!result) {
      return res.status(status.NOT_FOUND).json({
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

    return res.status(status.FOUND).json({
      msg: "Logged in Successfully",
      user: userExist,
      success: true
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/verify", isLogin, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.post("/logout", isLogin, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logout successfully" });
});

export default router;
