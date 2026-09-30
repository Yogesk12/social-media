import User from "../models/user.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const authRegisterController = async (req,res) => {
    try{
        const {name,email,password} = req.body;
        console.log("name-------",req.body)
        if(!name || !email || !password){
            return res.send({
                statusCode : 400,
                message : "required fields are missing"
            })
        }

        if(password.length < 8){
            return res.send({
                statusCode : 400,
                message : "Password must be at least 8 characters"
            })
        }

        let normalizeEmail = email.trim().toLowerCase()
        const existingUser = await User.findOne({
            email : normalizeEmail
        })

        if(existingUser) {
            return res.send({
                statusCode : 200,
                message : "Email already exists"
            })
        }

        const passwordHash = await bcrypt.hash(password,12);

        const createUserResp = await User.create({
            name : name.trim(),
            email : normalizeEmail,
            password : passwordHash
        })

        console.log("createUserResp----------",createUserResp)

        res.send({
            statusCode : 200,
            message : "Account created successfully",
            user : {
                id : createUserResp._id,
                name : createUserResp.name,
                email : createUserResp.email
            }
        })
    }catch(err){
        console.log("err------",err)
        res.send({
            statusCode : 500,
            message : "Internal server error"
        })
    }
}

export const authLoginController = async (req,res) => {
    try{
        const {email,password} = req.body;
        console.log("req.body--------",req.body)

        if(!email || !password){
            return res.send({
                statusCode : 400,
                message : "required fields are missing"
            })
        }
        

        const existingUser = await User.findOne({
            email : email.trim().toLowerCase()
        }).select("+password")

        if(!existingUser) {
            return res.send({
                statusCode : 401,
                message : "Invalid Email or password"
            })
        }

        const passwordMatch = await bcrypt.compare(password,existingUser.password);

        if(!passwordMatch){
            return res.send({
                statusCode : 401,
                message : "Invalid Email or password"
            })
        }

        const token = jwt.sign({
            userId: existingUser._id.toString()
        },process.env.JWT_SECRET)

        res.send({
            statusCode : 200,
            message : "Login successfully",
            jwtToken : token
        })
    }catch(err){
        console.log("err------",err)
        res.send({
            statusCode : 500,
            message : "Internal server error"
        })
    }
}