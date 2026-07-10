import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fill required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password should be at least 6 characters" });
    }

    //check if email is valid : regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    //const user
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {

        await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);

      } catch (err) {
        console.log("Failed to send welcome email");
      }
    }

    
    else {
      return res.status(400).json({ message: "invalid user data" });
    }

  } catch (err) {
    console.log("Error in sign up controller: ", err);
    res.status(500).json({ message: "internal server error" });

  }
};

export const login = async(req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({message: "Email and password are required"});
  }
  
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "Invalid credentials!"});
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if(!isPassword){
      return res.status(400).json({message: "Invalid credentials!"});
    }

    generateToken(user._id , res);

    res.status(200).json({
      _id:user._id,
      fullName : user.fullName,
      email: user.email,
      profilePic : user.profilePic
    });

  } catch (error) {
    console.log("Error in login error");
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", {maxAge:0});
  res.status(200).json({message: "Logout successful!"});
 
};


export const updateProfile = async(req,res) => {
  try {
    const {profilePic} = req.body;

    if(!profilePic) return res.status(400).json({message:"No profile pic"});

    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findOneAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});

    res.status(200).json(updatedUser);


  } catch (error) {
    console.log("Error in updatedProfile", error);
    res.status(200).json({message: "Internal server error"});
  }
}