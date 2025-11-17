import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const geminiResponse = async (command,userName,assistantName) => {
  try {
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const apiKey = process.env.GEMINI_API_KEY;


    const prompt=`You are a virtual assistant name ${assistantName} created by ${userName}.
    You are not Google . You will now behace like a voice-enabled assistant.
    
    Your task i sto understand the user's natural language input and respond with a JSON object like this:
    {
    "type" :"general" | "google_search" | "yputube_search" | "youteube_play" |
    "get_time" | "get_date" | "get_day" | "get_month" |"calculator_open" |
    "instagram_open" | "facebook_open" | "weather_show" ,
    "userInput" : "<original user input>" {only remove your name from userinput if exists}
    and agar kisi ne google ya youtube pe kuch serach karne ko bola hai toh  userInput me only voh search vala text jaye,
    "response" :"<a short spoken response to read out loud to the user>"
       }
    
      Instructions :
      -"type":determine the intent of teh user.
      -"userinput":original sntence the user spoke.
      -"response":A short voice-frinedly reply, e.g.,"Sure, playing it now","Here's what I found",
      "Today is tuesday",etc.
      

      Type meanings:
      -"general":if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko general ki category me rakho bs short answer dena.
      -"googke_search":if user wants to serach something on Google.
      -"youtube_search": if user wants to search something on YouTube.
      -"youtube_play": if user wants to directly play a video or song.
      -"calculator_open" if user wants to open a calculator.
      -"instagram_open":if user wnats to open instgram.  
      -"facebook_open":if user wants to open facebook.
      -"weather-show":if user wants to know weather.
      -"get_time":if user asks for current time.
      -"get_date":if user asks for today's date.
      -"get_day":if user asks what day it is.
      -"get_month":if user asks for the current month.
      
      
      Important:
      -Use ${userName} agar koi puche tume kisne banaya 
      -Only respond with JSON object, nothing else.

      now your userInput-${command}
      `;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in .env");
    }

    const requestBody = {
      contents: [
        {
          role: "user", // ✅ Add role field
          parts: [
            {
              text: prompt, // ✅ Ensure this is dynamic, not string "prompt"
            },
          ],
        },
      ],
    };

    const response = await axios.post(`${apiUrl}?key=${apiKey}`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Extract clean text output
    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No output received from Gemini.";

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Gemini API failed to respond");
  }
};

export default geminiResponse;
