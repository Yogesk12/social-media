import express from "express"
import {authLoginController, authRegisterController} from '../controllers/auth.js'
import { authMiddleware } from "../middleware/auth.js";
import { getCurrentUser } from "../controllers/user.js";

const authrouter = express.Router();

authrouter.post("/register",authRegisterController)
authrouter.post("/login",authLoginController)
authrouter.post("/signup",authRegisterController)
authrouter.get("/me",authMiddleware,getCurrentUser)

export default authrouter;
