import User from "../models/user.model.js";

export const getUser = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(allUsers);

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}