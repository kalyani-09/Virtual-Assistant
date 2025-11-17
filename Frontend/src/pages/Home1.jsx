import React from "react"
import { useContext ,useState,useRef} from "react";
import {userDataContext} from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Add missing import
import { useEffect } from "react";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { IoMicOff } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";



function Home(){
   

    const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext);
    const navigate=useNavigate();
    const [listening,setListening]=useState(false);
    const isSpeakingRef=useRef(false);
    const recognitionRef=useRef(null);
    const [userText,setUserText]=useState("");
    const [aiText,setAiText]=useState("");
    const [showAiImage,setShowAiImage]=useState(false);
    const isRecognizingRef=useRef(false);
    const [showMenu , setShowMenu]=useState(false);
     // ✅ Add useEffect to refresh userData on mount to get latest history
     useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
              const response = await axios.get(`${serverUrl}/api/user/current`, {
                  withCredentials: true
              });
              if (response.data) {
                  setUserData(response.data);
                  console.log("User data refreshed, history:", response.data.history);
              }
          } catch (error) {
              console.error("Error fetching current user:", error);
          }
      };
      fetchCurrentUser();
  }, []); // ✅ Run once on mount

   // ✅ Debug: Log userData changes to see if history is updating
   useEffect(() => {
    console.log("=== userData State ===");
    console.log("userData:", userData);
    console.log("userData.history:", userData?.history);
    console.log("History is array:", Array.isArray(userData?.history));
    console.log("History length:", userData?.history?.length);
    if (userData?.history && userData.history.length > 0) {
        console.log("First history item:", userData.history[0]);
        console.log("First history item type:", typeof userData.history[0]);
    }
}, [userData]);

    const synth=window.speechSynthesis;
     useEffect(() => {
  return () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop(); // Force stop
        console.log("Recognition forcibly stopped on unmount");
      } catch (err) {
        console.log("Cleanup stop error:", err);
      }
    }
  };
}, []);

    const handleLogOut=async()=>{
        try{
            const result= await axios.get(`${serverUrl}/api/auth/logout`,
                {withCredentials:true})
                setUserData(null)
                navigate("/signin")
        }catch(error){
            setUserData(null)
            console.log(error);
        }
    }

    // const startRecognition=()=>{
    //     try{
    //         recognitionRef.current?.start();
    //         setListening(true);

    //     }catch(error){
    //         if(!error.message.includes("start")){
    //             console.error("Recognition error :",error);
    //         }
    //     }
    // }
    const startRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
        if (recognition.state !== "started") {
            recognition.start();
            console.log("Recognition started safely");
            setListening(true);
        }
    } catch (error) {
        if (error.name !== "InvalidStateError") {
            console.error("Recognition start error:", error);
        }
    }
};
const speak=(text)=>{
    // const utterance=new SpeechSynthesisUtterance(text);
    // window.speechSynthesis.synth.speak(utterance);
    // isSpeakingRef.current=true;
    // utterance.onend=()=>{
    //     isSpeakingRef.current=false
    //     recognitionRef.current?.start()
    // }
    // synth.speak(utterance);
    //   const utterance = new SpeechSynthesisUtterance(text);

    // // stop any ongoing speech
    // window.speechSynthesis.cancel();

    // // speak
    // window.speechSynthesis.speak(utterance);

    // isSpeakingRef.current = true;

    // utterance.onend = () => {
    //     isSpeakingRef.current = false;
    //     recognitionRef.current?.start();
    // };
     if (!text) return;

    // Always use lowercase speechSynthesis
    const synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(text);

    // Unlock on first play
    synth.cancel();  // ensures speech restarts clean
    synth.resume();



    utterance.lang="hi-IN";
    const voices=window.speechSynthesis.getVoices();
    const hindiVoice=voices.find(v=>v.lang==="hi-IN");
    if(hindiVoice){
        utterance.voice=hindiVoice;
    }
    synth.speak(utterance);

    isSpeakingRef.current = true;

    

    utterance.onend = () => {
        isSpeakingRef.current = false;
        setAiText("");
        // recognitionRef.current?.start();
        // startRecognition();
    };

    utterance.onerror = (err) => {
        console.error("Speech error:", err);
        isSpeakingRef.current = false;
        recognitionRef.current?.start();
    };
}

const handleCommand=(data)=>{
    const {type,userInput,response}=data;
    speak(response);
    if(type==="google_search"){
        const query=encodeURIComponent(userInput);
        window.open(`https://www.google.com/search?q=${query}`,'_blank');

    }
     if(type==="calculator_open"){
        
        window.open(`https://www.google.com/search?q=calculator`,'_blank');
        
    }
     if(type==="instagram_open"){
        
        window.open(`https://www.instagram.com/`,'_blank');
        
    }
     if(type==="facebook_open"){
        
        window.open(`https://www.facebook.com/`,'_blank');
        
    }
     if(type==="weather_show"){
        
        window.open(`https://www.google.com/search?q=weather`,'_blank');
        
    }
     if(type==="youtube_search" || type==="youtube_play"){
        const query=encodeURIComponent(userInput);
        window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');

    }

}

    useEffect(()=>{
         // Unlock speech on first user click
  const enableSpeech = () => {
    window.speechSynthesis.resume();
    console.log("Speech unlocked");
    window.removeEventListener("click", enableSpeech);
  };
       
   window.addEventListener("click", enableSpeech);
        const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition ;
        if (!SpeechRecognition) {
    console.log("Speech recognition not supported");
    return;
  }
        const recognition=new SpeechRecognition()
        recognition.continuous=true,

        recognition.lang='en_US',
        recognitionRef.current=recognition;


        // const isRecognizingRef={current:false}
        const safeRecognition=()=>{
            if(!isSpeakingRef.current && !isRecognizingRef.current){
                try{
                    recognition.start();
                    console.log("Recognition requested to start");
                }catch(err){
                    if(err.name !== "InvalidStateError"){
                        console.error("Start error:",err);
                    }
                }
            }
        } 
       recognition.onstart = () => {
    console.log("Recognition started");
    isRecognizingRef.current = true;
    setListening(true);
};
       recognition.onend = () => {
    console.log("Recognition ended");
    isRecognizingRef.current = false;
    setListening(false);

    if (!isSpeakingRef.current) {
        setTimeout(() => {
            try {
                recognition.start();
                isRecognizingRef.current = true;
            } catch (e) {}
        }, 800);
    }
};
        recognition.onerror=(event)=>{
            console.warn("Recognition error:",event.error);
            isRecognizingRef.current=false;
            setListening(false);
            if(event.error !=="aborted" && !isSpeakingRef.current){
                setTimeout(()=>{
                    safeRecognition();
                },1000);
            }
        };
        

        recognition.onresult=async (e)=>{
            const transcript=e.results[e.results .length-1][0].transcript.trim()
            console.log("heard :"+transcript);
            setAiText("");
            setUserText(transcript);
             if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
                recognition.stop();
setListening(false);                
            const data=await getGeminiResponse(transcript);
            if(!data){
                 console.log("AI returned no data.");
    speak("Sorry, I could not understand that.");
    return;
            }
            console.log(data);
              // ✅ Always update history if it exists in response
              if (data.history && Array.isArray(data.history)) {
                console.log("Updating history from response:", data.history);
                setUserData(prev => {
                    console.log("Previous userData:", prev);
                    console.log("New history:", data.history);
                    return {
                        ...prev,
                        history: data.history
                    };
                });
            } else {
                console.warn("No valid history in response:", data.history);
            }
            
if (!data.response) {
    console.log("No response field in data:", data);
    speak("Something went wrong while getting the response.");
    return;
}
            console.log(data.response);
            // speak(data.response);
            handleCommand(data);
            if (data.history && Array.isArray(data.history)) {
  setUserData(prev => ({
    ...prev,
    history: [...data.history]
  }));
}
            setAiText(data.response);
            setUserText("");
        }
        }

       
        // recognition.start();

        const fallback=setInterval(()=>{
             if(!isSpeakingRef.current && !isRecognizingRef.current){
                safeRecognition();

             }
        },1000)
        return ()=>{
            recognition.stop();
            setListening(false);
            isRecognizingRef.current=false;
            clearInterval(fallback);
        }

    },[])



    return (
        <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 gap-7">
            <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-2 right-5 rounded-full text-[19px]  hidden lg:block px-5 py-2.5" onClick={()=>handleLogOut()}>Log Out </button>
            <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-20 right-5 rounded-full text-[19px] hidden lg:block px-5 py-2.5" onClick={()=>navigate("/customize")}>Customize your Assistant</button>
           
           
            <GiHamburgerMenu  className="lg:hidden text-white absolute top-5 right-5 w-[25px] h-[25px]" onClick={()=>setShowMenu(true)}/>
            {/* <div className="absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg flex flex-col gap-5">
            <RxCross2  className="lg:hidden text-white absolute top-5 right-5 w-[25px] h-[25px]"/>
            <button className="min-w-[150px] h-[60px] mt-[30px] text-black top-2 font-semibold bg-white absolute  rounded-full text-[19px]   px-5 py-2.5" onClick={()=>handleLogOut()}>Log Out </button>
            <button className="min-w-[150px] h-[60px] mt-[30px] text-black   top-20  font-semibold bg-white absolute  rounded-full text-[19px]  px-5 py-2.5" onClick={()=>navigate("/customize")}>Customize your Assistant</button>
            

            <div className="w-full h-0.5 bg-gray-400 top-10"></div>
            <h1 className="text-white font-semibold text-[19px]">History</h1>
            <div className="w-full h-[60%] overflow-auto flex flex-col gap-5 items-start">
{userData?.history
  ? userData.history.map((his, i) => {
      return (
        <span key={i} className="text-gray-400 text-[18px] truncate mt-5">
          {his}
        </span>
      );
    })
  : null}
            </div>
            </div> */}
            <div className='w-full h-screen bg-linear-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col '>
         <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg gap-15px">
            <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>



         </div>
         <h1 className="text-white text-[18px] font-semibold ">I'm {userData?.assistantName}</h1>
         {!showAiImage && <IoMicOff  className="   text-4xl text-white mt-10" onClick={()=>setShowAiImage(true)}/>}

         {(!aiText && showAiImage) && <img src={userImg} alt="" className="w-[200px]"/>}
           {aiText && <img src={aiImg} alt="" className="w-[200px]"/>}
           <h1 className="text-white">{userText ? userText:aiText?aiText:null}</h1>
            </div>
            
         
         {showMenu && (
  <div className="absolute inset-0 bg-[#00000053] backdrop-blur-lg flex flex-col gap-5 lg:hidden p-5 transition-transform">

    {/* Close button */}
    <RxCross2
      className="text-white absolute top-2 right-5 w-[25px] h-[25px] cursor-pointer"
      onClick={() => setShowMenu(false)}
    />

    <button
      className="h-[55px] w-fit text-black font-semibold bg-white rounded-full text-[18px] px-5 py-2"
      onClick={() => handleLogOut()}
    >
      Log Out
    </button>

    <button
      className="h-[55px] w-fit text-black font-semibold bg-white rounded-full text-[18px] px-5 py-2"
      onClick={() => navigate("/customize")}
    >
      Customize your Assistant
    </button>

    <div className="w-full h-0.5 bg-gray-400 mt-3"></div>

    <h1 className="text-white font-semibold text-[19px]">History</h1>
     {/* ✅ Debug: Show history count */}
     {/* <div className="text-white text-xs px-5">Count: {userData?.history?.length || 0}</div> */}

<div className="w-full h-[60%] overflow-y-auto flex flex-col gap-3 items-start px-5 pb-5">
  {userData?.history && Array.isArray(userData.history) && userData.history.length > 0 ? (
    userData.history.map((his, i) => {
      // ✅ Handle both string and object formats
      const historyText = typeof his === 'string' ? his : (his?.toString() || JSON.stringify(his));
      console.log(`Rendering history item ${i}:`, historyText); // ✅ Debug log
      return (
        <div key={i} className="text-gray-400 text-[16px] w-full py-2 ">
          {historyText}
        </div>
      );
    })
  ) : (
    <span className="text-gray-500 text-[16px] mt-5">No history yet</span>
  )}
</div>
    </div>
  
)}


        </div>
    )
}
export default Home;