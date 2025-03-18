import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";


const app = express();
app.use(cookieParser());
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)


app.listen(port, () => {
    connectDB();
  console.log(`Server is running on port ${port}`);
})