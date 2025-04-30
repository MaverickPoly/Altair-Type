import TestModel from "../models/test.model.js";
import mongoose from "mongoose";

// Create New Test
export const createTest = async (req, res) => {
  try {
    const { wpm, accuracy, time, type, wordCount, language } = req.body;
    const userId = req.userId;

    if (!wpm || !accuracy || !time || !type || !wordCount || !language) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const test = new TestModel({
      wpm,
      accuracy,
      time,
      type,
      wordCount,
      language,
      userId,
    });
    await test.save();
    res.status(201).json({ message: "Test created successfully!" });
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// All Tests for User
export const allTests = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid id!" });
    }

    const tests = await TestModel.find({ userId: userId });
    res.json(tests);
  } catch (e) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Clear All Tests of a user
export const clearTests = async (req, res) => {
  try {
    const userId = req.userId;
    await TestModel.deleteMany({ userId: userId });
    res.json({ message: "All tests deleted successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Get Test details
export const getTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid test id!" });
    }

    const test = await TestModel.find({ _id: id, userId: userId });
    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    res.json({ message: "Test fetched successfully!", data: test });
  } catch (e) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Delete specific test
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(500).json({ message: "Invalid test id!" });
    }

    const test = await TestModel.findById(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found!" });
    }

    if (userId !== test.userId.toString()) {
      return res
        .status(400)
        .json({ message: "You can only delete your tests!" });
    }

    await TestModel.findByIdAndDelete(id);
    res.json({ message: "Test deleted successfully!" });
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Leaderboard Stats
export const leaderboardStats = async (req, res) => {
  try {
    const stats = await TestModel.aggregate([
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
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          username: "$user.username",
          averageWpm: { $round: ["$averageWpm", 2] },
          averageAccuracy: { $round: ["$averageAccuracy", 2] },
          totalTests: 1,
          totalWords: 1,
        },
      },
      {
        $sort: { averageWpm: -1 },
      },
    ]);

    res.json(stats);
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json({ message: "Internal server error!" });
  }
};
