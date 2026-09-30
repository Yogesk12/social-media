import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next) => {
    try{
        const authorization = req.headers.authorization;

        if(!authorization){
            return res.status(401).send({
                message : "Authorization token is required"
            })
        }

        const token = authorization.startsWith("Bearer") ? authorization.split(" ")[1] : null;

        if(!token){
            return res.send({
                statusCode : 401,
                message : "Invalid authorization token"
            })
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        console.log("decodedtoek----------",decodedToken)
        // req.userId = 
        next();

    }catch(err){
        console.log("err----------",err)
        res.send({
            stausCode : 401,
            message : "Invalid or expired token"
        })
    }
}