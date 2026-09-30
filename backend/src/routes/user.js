import express from "express";
import { getCurrentUser } from "../controllers/user.js";
import { deleteComment } from "../controllers/posts.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();
router.get("/me", authMiddleware, getCurrentUser);
router.delete("/comments/:id", authMiddleware, deleteComment);
export default router;
