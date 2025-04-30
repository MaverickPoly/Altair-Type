import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import TestModel from "../models/test.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username!" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const userPayload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "14d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.json({ message: "Logged in successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    let userExists = await UserModel.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists!" });
    }
    userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully!" });
};

// User Profile
export const profile = async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id!" });
  }

  try {
    const user = await UserModel.findById(id).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// TODO: To Be continued when we add new fields to model
// Edit Profile
export const editProfile = async (req, res) => {
  const {} = req.body;
  const userId = req.cookie.userId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(500).json({ message: "Server error" });
    }

    res.json({ message: "Profile edited successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const myProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error!" });
  }
};

export const userTestStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id!" });
    }

    const stats = await TestModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: "$userId",
          averageWpm: { $avg: "$wpm" },
          averageAccuracy: { $avg: "$accuracy" },
          totalTests: { $sum: 1 },
          totalWords: { $sum: "$wordCount" },
        },
      },
      {
        $project: {
          averageWpm: { $round: ["$averageWpm", 2] },
          averageAccuracy: { $round: ["$averageAccuracy", 2] },
          totalTests: 1,
          totalWords: 1,
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({
        averageWpm: 0,
        averageAccuracy: 0,
        totalTests: 0,
        totalWords: 0,
      });
    }

    res.json(stats[0]);
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json({ message: "Internal server error!" });
  }
};
