import React, { useState, useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Customize2() {
  const { userData, backendImage, selectedImage, setUserData, serverUrl } =
    useContext(userDataContext);

  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("assistantImage", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      console.log(result.data);
      setUserData(result.data);
      navigate("/"); // ✅ go to Home
    } catch (error) {
      console.error("Error updating assistant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 relative">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white text-[30px] text-center mb-5">
        Enter your <span>Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="Enter your Name"
        className="w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
        onChange={(e) => {setAssistantName(e.target.value)}}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[250px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] p-2.5"
          onClick={handleUpdateAssistant}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Your Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
