import express from "express";
import {
  login,
  register,
  logout,
  profile,
  editProfile,
  myProfile,
  fetchAllUsers,
  userTestStats,
} from "../controllers/auth.controller.js";
import { loginRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes
router.post("/login", login);
router.post("/register", register);
router.post("/logout", loginRequired, logout);
router.get("/user/:id", loginRequired, profile);
router.get("/me", loginRequired, myProfile);
router.post("/user/edit", loginRequired, editProfile);
router.get("/users/", loginRequired, fetchAllUsers);
router.get(`/user/:userId/stats`, loginRequired, userTestStats);

export default router;
