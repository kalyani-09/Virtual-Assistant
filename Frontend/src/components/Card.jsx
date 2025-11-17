import React from "react"
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({image, onClick}){
    const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,
        setFrontendImage,selectedImage,setSelectedImage
      }=useContext(userDataContext);
    return (
      <div
  className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl
  overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
  ${selectedImage === image ? "shadow-blue-950 cursor-pointer border-4 border-white" : "null"}`}
  onClick={() => setSelectedImage(image)}
>
  <img src={image} className="h-full w-full object-cover" alt="uploaded" />
</div>

    )
}

export default Card;