import dotenv from "dotenv";
const result = dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import path from "path"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();
app.use(express.json());

app.use(cookieParser());

const __dirname = path.resolve();


const PORT = ENV.PORT || 3000;


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)


// making ready for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(PORT, async() => {
    console.log(`server is listening on port ${PORT}`);
    await connectDB();
})