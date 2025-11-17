
import bg from "../assets/authBg.png";
import axios from "axios";
import { FaEye , FaEyeSlash  } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function SignUp(){
    const [showPassword, setShowPassword]= useState(false);
    const navigate= useNavigate();
    const [name, setName]= useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error, setError]=useState("");
    const [loading,setLoading]=useState(false);

    const {serverUrl,userData,setUserData} =useContext(userDataContext);

    const handleSignUp=async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            let result = await axios.post(`${serverUrl}/api/auth/signup`,{
                name,email,password
            },{withCredentials:true}) 
            console.log(result);
            setUserData(result.data);
            setLoading(false);
            navigate("/");
        }catch(error){
            console.log(error);
            setUserData(null);
            setError(error.response.data.message);
            setLoading(false);
        }

    }
    return(
        
        <div className='w-full h-screen bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
         <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5' onSubmit={handleSignUp}>
            <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
            <input type="text" placeholder="Enter your Name" className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5
            rounded-full text-[18px]' onChange={(e)=>{setName(e.target.value)}} value={name}></input>
            <input type="email" placeholder="Enter your Email" className='w-full h-[60px] outline-none border-2
            border-white bg-transparent text-white placeholder-gray-300 px-5 py-[10y] rounded-full text-[18px]' onChange={(e)=>{setEmail(e.target.value)}} value={email}></input>
            <div className=' relative w-full h-[60px] border-2 border-white bg-transparent rounded-full text-white'>
            <input onChange={(e)=>{setPassword(e.target.value)}} value={password}
             type={showPassword ? "text" : "password"} placeholder="password" className="w-full h-full  outline-none bg-transparent placeholder-gray-300 px-5 py-2.5"></input>
             {/* {!showPassword && <FaEye className='absolute  top-[18px] right-5 w-5 h-5 text-[white]' onClick={()=>setShowPassword(true)} />} */}
             {showPassword===false ? <FaEye className='absolute  top-[18px] right-5 w-5 h-5 text-[white]' onClick={()=>setShowPassword(true)}/> : <FaEyeSlash className='absolute  top-[18px] right-5 w-5 h-5 text-[white]' onClick={()=>setShowPassword(false)}/> }
            
            </div> 
            {error && <p className="text-red-500 text-[17px]">{error}</p>}
            <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-19px" disabled={loading}>{loading ? "Loading....":"Sign Up"}</button>
            

            <p className="text-[white] text-[18px] cursor-pointer"
            onClick={()=>navigate("/signin")}>Already have an account?<span className="text-blue-400">Sign In</span></p>
         </form>
            
        </div>
    )
}
export default SignUp;