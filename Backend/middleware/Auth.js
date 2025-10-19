import jwt from "jsonwebtoken";

const isLogin = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "SignUp First" });
    }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    
  } catch {
    res
      .status(401)
      .json({
        success: false,
        message: "Invalid token",
      });
  }
};

export default isLogin;