import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import geminiResponse from "./gemini.js";

dotenv.config();

import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const port = process.env.PORT || 5000;

const app= express();

//to except the request from any url 
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://virtualassistantfrontend-nnvc.onrender.com",
       
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
//to convert the data into json
app.use(express.json());


app.use(cookieParser());

//it is the route
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);



// app.post("/api/gemini/ask",async(req,res)=>{
//     let prompt =req.query.prompt
//     let data= await geminiResponse(prompt)
//     res.json(data);
// })
// app.post("/api/gemini/ask", async (req, res) => {
//     const prompt = req.body?.prompt ?? req.query?.prompt;
//     if (!prompt || !prompt.trim()) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }
//     const data = await geminiResponse(prompt.trim());
//     res.json({ output: data });
//   });

// app.get("/",(req,res)=>{
//     res.send("Hi server is working fine");
// });


// app.listen(port,(req,res)=>{
    
// console.log(`Server is running at ${port}`);
// });


//Connect to db first , then start the server
connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is runnig at port ${port}`)
    });
});
