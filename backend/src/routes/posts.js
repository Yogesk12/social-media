import express from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { authMiddleware } from "../middleware/auth.js";
import { createPost, createComment, deleteComment, deletePost, getPost, listComments, listPosts, updatePost } from "../controllers/posts.js";
const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({ destination: "uploads/", filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    cb(allowed.has(file.mimetype) ? null : new Error("Only JPG, PNG and WEBP images are allowed"), allowed.has(file.mimetype));
  }
});
const parseImage = (req, res, next) => upload.single("image")(req, res, error => {
  if (error) return res.status(400).json({ message: error.code === "LIMIT_FILE_SIZE" ? "Image must be 2 MB or smaller" : error.message });
  next();
});
router.use(authMiddleware);
router.get("/", listPosts);
router.post("/", parseImage, createPost);
router.get("/:id", getPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/:id/comments", listComments);
router.post("/:id/comments", createComment);
router.delete("/comments/:id", deleteComment);
export default router;
