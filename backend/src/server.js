import express from "express"
import "dotenv/config";
import cors from "cors";
import authrouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { connectMongoDB } from "./DB.js";

let app=express();
app.use(express.json());
app.use(cors({
    origin:"*",
    methods:["GET","POST","PATCH","PUT","DELETE"]
}))

connectMongoDB();

app.use("/api/auth",authrouter)
app.use("/api/",userRouter)



app.listen(process.env.PORT,() => {
    console.log("server listening on the port-------",process.env.PORT)
})

