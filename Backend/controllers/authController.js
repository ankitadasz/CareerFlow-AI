import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { generateToken } from "../utils/generateToken.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
 export const getMe = async(req,res) =>{
    try {
        const user=await User.findByPk(req.user.id,{
            attributes:["id","name","email","role"],
        });
        if(!user){
            return res.status(400).json(
                {
                    message:"User not found",
                }
            )        }
             res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
        
    } catch (error) {
         console.error("Get user error:", error);
         res.status(500).json({
      message: "Something went wrong",
    });
    }
 }
 export const logout = (req, res) => {
  res.json({
    message: "Logout successful",
  });
};