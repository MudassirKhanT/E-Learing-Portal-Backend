import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = {
      name,
      email,
      password: hashPassword,
    };
    const otp = Math.floor(Math.random() * 100000);
    const token = jwt.sign(
      {
        user,
        otp,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "360m",
      }
    );
    const data = {
      name,
      otp,
    };
    await sendMail(email, "E Learning", data);
    res.status(200).json({ message: "Otp send to your mail", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
