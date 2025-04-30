import express from "express";
import { loginRequired } from "../middleware/auth.middleware.js";
import {
  allTests,
  clearTests,
  createTest,
  deleteTest,
  getTest,
  leaderboardStats,
} from "../controllers/test.controller.js";

const router = express.Router();

router.post("/create", loginRequired, createTest);
router.get("/:userId/all", loginRequired, allTests);
router.get("/clear", loginRequired, clearTests);
router.get("/test/:id", loginRequired, getTest);
router.delete("/test/:id", loginRequired, deleteTest);
router.get("/leaderboard", loginRequired, leaderboardStats);

export default router;
