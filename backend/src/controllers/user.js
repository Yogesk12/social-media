import User from "../models/user.js";
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.userId).select("name email");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: { id: user._id, name: user.name, email: user.email } });
};
