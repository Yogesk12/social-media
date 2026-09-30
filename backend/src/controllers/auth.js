import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const decryptPassword = (payload) => {
  if (!process.env.LOGIN_ENCRYPTION_KEY) throw new Error("LOGIN_ENCRYPTION_KEY is not configured");
  const packed = Buffer.from(payload, "base64");
  if (packed.length < 29) throw new Error("Invalid encrypted password");
  const decipher = crypto.createDecipheriv("aes-256-gcm", crypto.createHash("sha256").update(process.env.LOGIN_ENCRYPTION_KEY).digest(), packed.subarray(0, 12));
  decipher.setAuthTag(packed.subarray(-16));
  return Buffer.concat([decipher.update(packed.subarray(12, -16)), decipher.final()]).toString("utf8");
};

const issueToken = (user) => jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

export const authRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ message: "Enter a valid email address" });
    const clearPassword = decryptPassword(password);
    if (clearPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const normalized = email.trim().toLowerCase();
    if (await User.exists({ email: normalized })) return res.status(409).json({ message: "Email already exists" });
    const user = await User.create({ name: name.trim(), email: normalized, passwordHash: await bcrypt.hash(clearPassword, 12) });
    return res.status(201).json({ message: "Account created successfully", user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "Email already exists" });
    if (error.message === "Invalid encrypted password") return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const clearPassword = decryptPassword(password);
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(clearPassword, user.passwordHash))) return res.status(401).json({ message: "Invalid email or password" });
    return res.json({ jwtToken: issueToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.message === "Invalid encrypted password") return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Internal server error" });
  }
};
