import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const loginRequired = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Not authorized!" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (e) {
    res.status(401).json({ message: "Not authorized!" });
  }
};
