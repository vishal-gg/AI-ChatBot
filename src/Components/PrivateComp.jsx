import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase_config";

export default function PrivateComp() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsloggedIn] = useState(false);

  // Redirecting users to Dashboad based on their authenticity
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      authUser ? setIsloggedIn(true) : navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  return isLoggedIn ? <Outlet /> : null;
}
