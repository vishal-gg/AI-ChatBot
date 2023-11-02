import React, { useEffect, useState } from "react";
import { auth } from "../firebase_config";
import ChatBot from "./ChatBot";
import CanvasAnimation from './CanvasAnimation'

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    if (auth?.currentUser?.displayName) {
      setUserName(auth?.currentUser?.displayName);
    } else {
      setUserName(JSON.parse(localStorage.getItem("userName")));
    }
    setUserProfile(auth?.currentUser?.photoURL);
  }, []);


  return (
    <div className="h-screen p-4 max-[678px]:p-0 flex justify-center items-center">
      <CanvasAnimation />
      <ChatBot name={userName} profile={userProfile} />
    </div>
  );
}

export default Dashboard;
