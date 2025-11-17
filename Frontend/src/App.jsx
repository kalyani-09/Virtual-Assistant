import React from 'react';
import {Routes, Route, Navigate, } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import { userDataContext } from './context/UserContext';
import { useContext } from 'react';
import Home from "./pages/Home";
function App(){

  const {userData,setUserData}=useContext(userDataContext);
  return (
   
    <Routes>
      
      <Route path="/" element={(userData?.assistantImage && userData?.assistantName) ? <Home/> : <Navigate to={"/customize"}/>}></Route>

         <Route path="/signup" element={!userData?<SignUp/>:<Navigate to={"/"}/>} ></Route>
         <Route path="/signin" element={!userData?<SignIn/>:<Navigate to={"/"}/>}></Route>
          <Route path="/customize" element={userData?<Customize/>:<Navigate to={"/signup"}/>}></Route>
          <Route path="/customize2" element={userData?<Customize2/>:<Navigate to={"/signup"}/>}></Route>
        
    </Routes>
  )
}

export default App;