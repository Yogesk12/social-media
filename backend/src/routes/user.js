import express from "express"
import { getCurrentUser } from "../controllers/user.js";
import { authMiddleware } from "../middleware/auth.js";
const userRouter = express.Router();


userRouter.get("/me",authMiddleware,getCurrentUser)

export default userRouter;