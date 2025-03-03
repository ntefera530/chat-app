import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message-model.js";


export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);
    }
    catch (error) {
        console.log("Error in getUsersForSidebar Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const getMessages = async (req, res) => {
    try{
        const {id: theirId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, recieverId: theirId},
                {senderId: theirId, recieverId: myId},
            ]
        });

        res.status(200).json(messages);
    }
    catch (error) {
        console.log("Error in getMessages Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try{

        const {text, body} = req.body;
        const {id: theirId } = req.params;
        const myId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            myId,
            theirId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //TODO add real-time functionality with sockets

        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error in sendMessage Controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}