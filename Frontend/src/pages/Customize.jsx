import React, { useRef, useState } from "react";
import Card from "../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { FaUpload } from "react-icons/fa6";
import { useContext } from "react";
import {useNavigate} from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { userDataContext } from "../context/UserContext.jsx";
function Customize(){
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,
    setFrontendImage,selectedImage,setSelectedImage
  }=useContext(userDataContext);
  const navigate = useNavigate();
  const inputImage=useRef();
  const handleInput=(e)=>{
    const file= e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file));
    
  }
    return (
        <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5"> 
        <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]" onClick={()=>navigate(-1) || navigate("/")}/>
        <h1 className="text-white text-[30px] text-center mb-5">Select your <span>Assistant Image</span></h1>
          <div
  className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-5"
>
            <Card image={image1}/>
            <Card image={image2}/>
            <Card image={image3}/>
            <Card image={image4}/>
            <Card image={image5}/>
            <Card image={image6}/>
            <Card image={image7}/>
            <div className="w-20 h-40 lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl
  overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer 
  hover:border-4 hover:border-white flex items-center justify-center" onClick={()=>{inputImage.current.click();
    setSelectedImage("input");
    setBackendImage(null);
    setFrontendImage(null);
  }
  }>
  
  {!frontendImage && <FaUpload className="text-white w-[25px] h-[25px]" />}
{frontendImage && <img src={frontendImage} className="h-ful object-cover"/>}
</div>
<input type="file" accept="image/*" ref={inputImage} hidden onChange={handleInput}></input>

         </div>  
        
{selectedImage && <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-19px" onClick={()=>navigate("/customize2")}>Next</button>}
        </div>
    )
}
export default Customize;