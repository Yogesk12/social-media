export const getCurrentUser = async(req,res) => {
    try{
        let userId = req.userId
        const user = await user.findById(userId)

        if(!user){
            return res.send({
                statusCode : 401,
                message : "user not found"
            })
        }


        res.send({
            statusCode : 200,
            user : {
                id : user._id,
                name : user.name,
                email : user.email
            }
        })
    }catch(err){
        console.log("err------",err)
        res.send({
            statusCode : 500,
            message : "Internal server error"
        })
    }}