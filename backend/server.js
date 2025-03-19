import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"; 

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./db/db.js";
import { app,  server } from "./socket/socket.js";



dotenv.config();



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  }));


app.use(cookieParser());


app.use(express.json());


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers);
  next();
});


const port = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`JWT_SECRET is set: ${!!process.env.JWT_SECRET}`);
});