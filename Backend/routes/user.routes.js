import express from "express";
import { getCurrentUser, updateAssistant } from "../controllers/usercontrollers.js";
import isAuth from "../middlewares/isAuth.js";
import uplaod from "../middlewares/multer.js";
import geminiResponse from "../gemini.js";
import { askToAssistant } from "../controllers/usercontrollers.js";


const userRoutes = express.Router();

userRoutes.get("/current", isAuth, getCurrentUser);
userRoutes.post("/update",isAuth,uplaod.single("assistantImage"),updateAssistant);
userRoutes.post("/asktoassistant",isAuth,askToAssistant);

export default userRoutes;

