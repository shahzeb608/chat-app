import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    try {
    
        const token = req.cookies.token || req.cookies.refreshToken;
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized-No Token Provided" });
        }

        console.log("Received token:", token);
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment variables");
            return res.status(500).json({ message: "Server configuration error" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);
            
            const user = await User.findById(decoded.userId).select("-password");
            
            if (!user) {
                console.log("User not found with ID:", decoded.userId);
                return res.status(404).json({ message: "User not found" });
            }
            
            req.user = user;
            next();
        } catch (jwtError) {
            console.error("JWT verification failed:", jwtError);
            return res.status(401).json({ message: "Not authorized-Token Failed | Invalid Token" });
        }
    } catch (error) {
        console.error("Error in protect middleware:", error);
        res.status(401).json({ message: "Not authorized" });
    }
};