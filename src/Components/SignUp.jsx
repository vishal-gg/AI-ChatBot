import React, { useEffect, useState } from "react";
import "../custom styles/Form.css";
import { auth, googleProvider } from "../firebase_config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import GoogleIcon from "@mui/icons-material/Google";
import { Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regExError, setRegExError] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  useEffect(() => {
    localStorage.setItem("userName", JSON.stringify(name));
  }, [name]);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    setFirebaseError("");
    setRegExError("");

    if (!validateEmail(email)) {
      return setRegExError("Invalid email address");
    } else {
      setRegExError("");
    }

    //signUp with Email and Password
    const signUpEmailAndPassword = async () => {
      try {
        setLoading(true);
        if (email === "dummy@test.com" && password === "test123") {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      } catch (err) {
        let filterError = err.message.replace(
          /(Firebase|Error|auth|weak|password|[^a-zA-Z0-9 ])/g,
          " "
        );
        setFirebaseError(filterError);
        setLoading(false);
      }
    };
    signUpEmailAndPassword();
  };

  // Allowing users to signUp with Google cuz why Not
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

  // Redirecting users to dashboad after they authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      authUser && navigate("/dashboard", {replace: true});
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <div className="formContainer">
        <form onSubmit={handleFormSubmission}>
          <h2 className="text-3xl font-bold">Sign up</h2>
          <FormControl sx={{ m: 0, width: "100%" }} variant="standard">
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
          </FormControl>
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
              onChange={(e) => setPassword(e.target.value)}
              required
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
            startIcon={<SaveIcon />}
            variant="contained"
            type="submit"
          >
            continue
          </Button>
        </form>
        <p className="font-semibold">
          already have an account?{" "}
          <Link className="underline" to="/login">
            Log in
          </Link>
        </p>
        <div id="or">
          <span>or</span>
        </div>
        <Button
          style={{ width: "100%" }}
          startIcon={<GoogleIcon />}
          variant="contained"
          onClick={handleSignInWithGoogle}
        >
          continue with google
        </Button>
        {regExError && (
          <Alert
            style={{ fontSize: ".8rem", fontWeight: "700", marginTop: ".8rem" }}
            severity="error"
          >
            {regExError.toUpperCase()}
          </Alert>
        )}
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

export default SignUp;
