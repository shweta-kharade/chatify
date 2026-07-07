import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js"


export const signup = async(req, res) => {
    
    const {fullName, email , password, profilePic} = req.body;

    try{

        if(!fullName || !email || !password){
            return res.status(400).json({message: "fill required fields"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "password should be at least 6 characters"});
        }

        //check if email is valid : regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"});
        }

        //const user
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists with this email"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName: fullName,
            email : email,
            password: hashedPassword,
            
        });

        if(newUser){

            const savedUser  = await newUser.save();
            generateToken(newUser._id, res);
            

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic

            })
        }

        //todo: send a welcome email to the user
        
        else{
            return res.status(400).json({message: "invalid user data"});
        }



    }catch(err){
        console.log("Error in sign up controller: ", err);
        res.status(500).json({message: "internal server error"});
    }
}

export const login = (req, res) => {
    res.send("login endpoint");
};


export const logout = (req, res) => {
    res.send("logout endpoint");
}