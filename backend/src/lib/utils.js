import jwt from "jsonwebtoken";


export const generateToken = (userId , res) => {
    const {JWT_SECRET} = process.env;
    if(!JWT_SECRET){
        throw new Error("JWT secret is not configured");
    }
    const token = jwt.sign({userId}, JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 *60 * 60 * 1000, //milliseconds
        httpOnly:true, //prevent xss attacks: cross-site scripting
        sameSite: "strict", //csrf attacks
        secure: process.env.NODE_ENV === "production"?true : false

    });

    return token;
}

