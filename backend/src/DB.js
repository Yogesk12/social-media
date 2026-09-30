import mongoose from "mongoose"

export const connectMongoDB = async () => {
    try{
        let mongoDB = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected Successfully")


    }catch(err){
        console.log("sorry we can't be able to connect mongoDB")
        process.exit(1);

    }

}