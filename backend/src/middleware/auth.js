import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next) => {
    try{
        const authorization = req.headers.authorization;

        if(!authorization){
            return res.status(401).send({
                message : "Authorization token is required"
            })
        }

        const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

        if(!token){
            return res.status(401).send({
                statusCode : 401,
                message : "Invalid authorization token"
            })
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();

    }catch(err){
        res.status(401).send({
            statusCode : 401,
            message : "Invalid or expired token"
        })
    }
}
