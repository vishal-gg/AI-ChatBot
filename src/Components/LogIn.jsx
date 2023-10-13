import React, { useState, useEffect } from "react";
import "../custom styles/Form.css";
import { auth, googleProvider } from "../firebase_config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firebaseError, setFirebaseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmission = async (e, userEmail, userPass) => {
    e.preventDefault();
    setFirebaseError("");

      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, userEmail, userPass);
      } catch (err) {
        let filterError = err.message.replace(
          /(Firebase|Error|auth|[^a-zA-Z0-9 ])/g,
          " "
        );
        setFirebaseError(filterError);
        setLoading(false);
      }
  };

  const handleSignInWithGoogle = () => {
    const signUpWithGoogle = async () => {
      try {
        setLoading(true);
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        let filterError = err.message.replace(
          /(Firebase|Error|auth|[^a-zA-Z0-9 ])/g,
          " "
        );
        setFirebaseError(filterError);
        setLoading(false);
      }
    };
    signUpWithGoogle();
  };

  // redirect users to dashboad after authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      authUser && navigate("/dashboard", {replace: true});
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <div className="formContainer">
        <form onSubmit={e =>handleFormSubmission(e, email, password)}>
          <h2 className="text-3xl font-bold">Log in</h2>
          <Button
            style={{ width: "100%", marginTop: "1rem" }}
            startIcon={<GoogleIcon />}
            variant="contained"
            onClick={handleSignInWithGoogle}
          >
            continue with google
          </Button>
          <div style={{ paddingBottom: "0" }} id="or">
            <span>or</span>
          </div>
          <FormControl sx={{ m: 0, width: "100%" }} variant="standard">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <EmailIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl sx={{ m: 0, width: "100%" }} variant="standard">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    style={{ padding: "0" }}
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            style={{ margin: "1rem 0" }}
            startIcon={<LoginIcon />}
            variant="contained"
            type="submit"
          >
            continue
          </Button>
        </form>
        <div>
          <p className="font-semibold">
            don't have an account?{" "}
            <Link to="/signup" className="underline">
              Register
            </Link>
          </p>
          <button onClick={e => handleFormSubmission(e, 'demo@gmail.com', 'demo@00')} className="font-semibold py-[6px] px-4 mt-4 rounded-md bg-red-500 text-white">use demo account</button>
        </div>
        {firebaseError && (
          <Alert
            style={{ fontSize: ".8rem", fontWeight: "700", marginTop: ".8rem" }}
            severity="error"
          >
            {firebaseError.toUpperCase()}
          </Alert>
        )}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
