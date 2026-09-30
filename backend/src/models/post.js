import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  caption: { type: String, required: true, trim: true, maxlength: 500 },
  imageUrl: { type: String, required: true }
}, { timestamps: true });
export default mongoose.model("Post", postSchema);
