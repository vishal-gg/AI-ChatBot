import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase_config";
import LinearProgress from "@mui/material/LinearProgress";

function Home() {
  const [isLoggedIn, setIsloggedIn] = useState(null);
  
  auth.onAuthStateChanged((authUser) => setIsloggedIn(Boolean(authUser)));


  if (isLoggedIn === null) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen flex flex-col gap-1">
       <LinearProgress color="secondary" />
       <LinearProgress color="success" />
       <LinearProgress color="inherit" />
      </div> 
    )
  }

  return (
    <header className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {!isLoggedIn ? (
        <>
          <h1 className="text-2xl font-semibold text-center py-5 text-white">
            Welcome to our AI Chatbot!
            <br /> Before you begin, please login or signup.
          </h1>
          <nav>
            <ul className="flex gap-2 text-center text-sm font-semibold w-1/2 mx-auto">
              <li className="flex-grow bg-green-500 rounded-[4px] text-white py-1 cursor-pointer">
                <Link to="/login">Log in</Link>
              </li>
              <li className="flex-grow bg-green-500 rounded-[4px] text-white py-1 cursor-pointer">
                <Link to="/signup">Sign up</Link>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-center py-4 text-white">
            Welcome to our AI Chatbot!
          </h1>
          <Link
            className="bg-green-500 rounded-[4px] py-1 px-2 text-white font-semibold w-fit mx-auto cursor-pointer"
            to="/dashboard"
          >
            continue
          </Link>
        </div>
      )}
    </header>
  );
}

export default Home;
