import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "node:http";
import { Server } from "socket.io";
import fs from "node:fs";
import jwt from "jsonwebtoken";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postsRouter from "./routes/posts.js";
import { connectMongoDB } from "./DB.js";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173", methods: ["GET", "POST"] } });
fs.mkdirSync("uploads", { recursive: true });
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api/posts", postsRouter);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    socket.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch { next(new Error("Invalid or expired token")); }
});
io.on("connection", socket => {
  socket.on("post:join", ({ postId } = {}) => { if (typeof postId === "string") socket.join(`post:${postId}`); });
  socket.on("post:leave", ({ postId } = {}) => { if (typeof postId === "string") socket.leave(`post:${postId}`); });
});

const port = Number(process.env.PORT) || 4000;
connectMongoDB()
  .then(() => server.listen(port, () => console.log(`Server listening on ${port}`)))
  .catch(() => process.exit(1));
