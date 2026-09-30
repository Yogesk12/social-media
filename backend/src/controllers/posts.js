import fs from "node:fs/promises";
import path from "node:path";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";
import { io } from "../server.js";

const postPayload = (post, commentCount = 0) => ({ id: post._id, caption: post.caption, imageUrl: post.imageUrl, author: { id: post.author?._id || post.author, name: post.author?.name }, commentCount, createdAt: post.createdAt, updatedAt: post.updatedAt });
const commentPayload = (comment) => ({ id: comment._id, text: comment.text, author: { id: comment.author._id, name: comment.author.name }, createdAt: comment.createdAt });
const owns = (post, userId) => post.author._id?.toString() === userId || post.author.toString() === userId;

export const listPosts = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1), limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const [posts, total] = await Promise.all([Post.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("author", "name"), Post.countDocuments()]);
  const counts = await Comment.aggregate([{ $match: { post: { $in: posts.map(p => p._id) } } }, { $group: { _id: "$post", count: { $sum: 1 } } }]);
  const byPost = new Map(counts.map(c => [c._id.toString(), c.count]));
  res.json({ data: posts.map(p => postPayload(p, byPost.get(p._id.toString()) || 0)), page, limit, total });
};
export const getPost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Post not found" });
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) return res.status(404).json({ message: "Post not found" });
  const [commentCount, comments] = await Promise.all([Comment.countDocuments({ post: post._id }), Comment.find({ post: post._id }).sort({ createdAt: 1 }).populate("author", "name")]);
  res.json({ post: postPayload(post, commentCount), comments: comments.map(commentPayload) });
};
export const createPost = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "An image is required (JPG, PNG or WEBP, up to 2 MB)" });
  const caption = req.body.caption?.trim();
  if (!caption || caption.length > 500) { await fs.unlink(req.file.path).catch(() => {}); return res.status(400).json({ message: "Caption is required and must be at most 500 characters" }); }
  const post = await Post.create({ author: req.userId, caption, imageUrl: `/uploads/${req.file.filename}` });
  await post.populate("author", "name");
  res.status(201).json({ post: postPayload(post) });
};
export const updatePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Post not found" });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!owns(post, req.userId)) return res.status(403).json({ message: "You can only edit your own posts" });
  const caption = req.body.caption?.trim();
  if (!caption || caption.length > 500) return res.status(400).json({ message: "Caption is required and must be at most 500 characters" });
  post.caption = caption; await post.save(); await post.populate("author", "name");
  res.json({ post: postPayload(post, await Comment.countDocuments({ post: post._id })) });
};
export const deletePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Post not found" });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!owns(post, req.userId)) return res.status(403).json({ message: "You can only delete your own posts" });
  await Promise.all([Comment.deleteMany({ post: post._id }), post.deleteOne()]);
  const filePath = path.join(process.cwd(), "uploads", path.basename(post.imageUrl)); await fs.unlink(filePath).catch(() => {});
  res.json({ message: "Post deleted" });
};
export const listComments = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Post not found" });
  if (!await Post.exists({ _id: req.params.id })) return res.status(404).json({ message: "Post not found" });
  const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: 1 }).populate("author", "name");
  res.json({ data: comments.map(commentPayload) });
};
export const createComment = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Post not found" });
  if (!await Post.exists({ _id: req.params.id })) return res.status(404).json({ message: "Post not found" });
  const text = req.body.text?.trim();
  if (!text || text.length > 300) return res.status(400).json({ message: "Comment must be between 1 and 300 characters" });
  const comment = await (await Comment.create({ post: req.params.id, author: req.userId, text })).populate("author", "name");
  const payload = commentPayload(comment);
  io.to(`post:${req.params.id}`).emit("comment:new", { postId: req.params.id, comment: payload });
  res.status(201).json({ comment: payload });
};
export const deleteComment = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Comment not found" });
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.userId) return res.status(403).json({ message: "You can only delete your own comments" });
  const postId = comment.post.toString(); await comment.deleteOne();
  io.to(`post:${postId}`).emit("comment:deleted", { postId, commentId: req.params.id });
  res.json({ message: "Comment deleted" });
};
