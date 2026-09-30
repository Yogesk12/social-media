import express from "express"
import {authLoginController, authRegisterController} from '../controllers/auth.js'

const authrouter = express.Router();

authrouter.post("/register",authRegisterController)
authrouter.post("/login",authLoginController)

export default authrouter;