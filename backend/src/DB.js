import mongoose from "mongoose";

const defaultMongoUri = "mongodb://127.0.0.1:27017/mini-social-feed";

export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim() || defaultMongoUri;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    const message = String(error?.message || "");
    console.error("MongoDB connection failed.");
    if (error?.code === "ECONNREFUSED" || message.includes("ECONNREFUSED")) {
      console.error("Connection was refused. Confirm MongoDB is running and the host and port in MONGO_URI are correct.");
    } else if (message.includes("querySrv") || message.includes("ENOTFOUND")) {
      console.error("MongoDB SRV DNS lookup failed. Check network DNS access or use a reachable mongodb:// connection string.");
    } else if (error?.code === 18 || message.includes("Authentication failed")) {
      console.error("MongoDB rejected the credentials. Check the database username and password in MONGO_URI.");
    } else {
      console.error(`${error?.name || "Error"}${error?.code ? ` (${error.code})` : ""}: ${message.replaceAll(mongoUri, "[MONGO_URI]").slice(0, 500)}`);
    }
    throw error;
  }
};
