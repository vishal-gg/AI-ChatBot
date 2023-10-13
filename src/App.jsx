import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import SignUp from "./Components/SignUp";
import PrivateComp from "./Components/PrivateComp";
import Dashboard from "./Components/Dashboard";
import LogIn from "./Components/LogIn";
import NotFound from "./Components/NotFound";
import {Toaster} from 'sonner';

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<PrivateComp />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
