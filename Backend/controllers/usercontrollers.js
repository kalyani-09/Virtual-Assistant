import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";
import { response } from "express";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting current user" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, assistantImage } = req.body;
    let imageUrl = assistantImage;

    // If user uploaded custom file
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) imageUrl = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage: imageUrl },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Update Assistant Error:", error);
    res.status(500).json({ message: "updateAssistantError" });
  }
};


export const askToAssistant = async(req,res)=>{
  try{
    const {command}=req.body;
    const user= await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({response:"User not found"});
    }
    user.history.push(command);
    user.save();
    const userName=user.name;
    const assistantName=user.assistantName;
     const updatedUser = await User.findById(req.userId);
    const result=await geminiResponse(command,userName,assistantName)

    const jsonMatch = result.match(/{[\s\S]*}/)
    if(!jsonMatch){
      history: updatedUser.history
      return res.status(400).json({response:"Sorry,I m unable to understand"});
      

    }
    const gemResult= JSON.parse(jsonMatch[0]);
    const type=gemResult.type;
    switch(type){
      case 'get_date':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current data is ${moment().format("YYYY-MM-DD")}`,
          history:updatedUser.history

        });
      case 'get_time':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current time is ${moment().format("hh-mmA")}`,
          history:updatedUser.history
        });
        case 'get_day':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`Today is ${moment().format("dddd")}`,
          history:updatedUser.history
        });
        case 'get_month':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`Now the month is  ${moment().format("MMMM")}`,
         history:updatedUser.history
        });
        case 'google_search':
        case 'youtube_search':
        case 'youtube_play':
        case 'general':  
        case 'calculator_open':
        case 'instagram_open':
        case  'facebook_open':
        case "weather_show":
          return res.json({
            type,
            userInput:gemResult.userInput,
           response:gemResult.response,
           history:updatedUser.history
          });
        default:
          return res.status(400).json({response:"I didn't understand that the task",history:updatedUser.history});
        
    }

    
  }catch(error){
    console.error("askToAssistant error:", error);
    // ✅ Return history even on server error
    try {
      const updatedUser = await User.findById(req.userId);
      return res.status(500).json({
        response:"There is an error in generating the response",
        history: updatedUser.history
      });
    } catch (dbError) {
      return res.status(500).json({
        response:"There is an error in generating the response"
      });
    }
}
}