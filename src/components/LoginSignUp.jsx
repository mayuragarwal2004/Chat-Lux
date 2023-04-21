/* eslint-disable default-case */
import React, { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, db } from "./base";
import { doc, setDoc } from "firebase/firestore";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useAuth } from "./context/auth/AuthState";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import PhoneNumber from "./PhoneNumber";
import "./css/auth.css";
import TextField from "@mui/material/TextField";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [phnostatus, setphnostatus] = useState({ msg: "", type: "success" });
  const [fullname, setfullname] = useState("");
  const [phno, setphno] = useState({ phone: "91", valid: false });
  const [loginstate, setloginstate] = useState(false);
  const [imageurl, setimageurl] = useState();
  console.log(currentUser);

  useEffect(() => {
    if (currentUser) {
      setloginstate(true);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      if (!phno.phone) {
        setphno({ phone: currentUser.phoneNumber, valid: false });
      }
      if (!fullname) {
        setfullname(currentUser.displayName);
      }
      // ...
    } else {
      // User is signed out
      // ...
      console.log("signed out detected");
      setloginstate(false);
    }
  }, [currentUser]);

  const handleChangeFullname = (event) => {
    const value = event.target.value;
    setfullname(value);
  };

  function handleChange(e) {
    console.log("Hello World");
    const file = e.target.files[0];
    console.log(e);
    const storage = getStorage();
    const date = new Date().getTime();
    const storageRef = ref(storage, `${fullname + date}`);

    // 'file' comes from the Blob or File API
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setimageurl(downloadURL);
        });
      }
    );
  }

  const handleChangePhno = (value) => {
    setphno(value);
    setotpreq(false);
    setphnostatus({ msg: "", type: "success" });
  };

  console.log(imageurl);

  const handleNameSubmit = (e) => {
    // console.log(e.target[0].value);
    e.preventDefault();
    // return
    if (!fullname) {
      alert("Enter your name");
      return;
    } else if (!imageurl) {
      alert("Select an image");
      return;
    }
    updateProfile(currentUser, {
      displayName: fullname,
      photoURL: imageurl,
    })
      .then(async () => {
        // Profile updated!
        // ...
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            phoneNumber: phno.phone,
            displayName: fullname,
            uid: currentUser.uid,
            photoURL: imageurl,
          },
          { merge: true }
        );
        await setDoc(doc(db, "userChats", currentUser.uid), {});
        navigate("/", { replace: true });
        console.log("profile updates");
      })
      .catch((error) => {
        // An error occurred
        // ...
        console.log(error);
      });
  };

  function handlesignout() {
    console.log("nothing");
    if (currentUser) {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
        });
    }
  }

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };
  // console.log(phno.phone.slice(0, 3));
  const [otp, setotp] = useState("");
  const [otpreq, setotpreq] = useState(false);
  function requestOTP(e) {
    e.preventDefault();
    setphnostatus({ msg: "Verifying phone number", type: "info" });
    if (phno.valid) {
      setphnostatus({ msg: "OTP  is being sent...", type: "info" });
      try {
        if (!window.recaptchaVerifier) {
          generateRecaptcha();
        }
      } catch (err) {
        console.log("Error caught");
        setphnostatus({
          msg: "Error occured: " + err.code,
          type: "error",
        });
      }
      if (window.recaptchaVerifier) {
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phno.phone, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setphnostatus({
              msg: "OTP is sent. Please Check you messages.",
              type: "info",
            });
            setotpreq(true);
          })
          .catch((error) => {
            setphnostatus({
              msg: error,
              type: "error",
            });
            console.log(error);
          });
      }
    } else {
      setphnostatus({ msg: "Phone Number in wrong format", type: "error" });
    }
  }

  const verifyOTP = (e) => {
    let otp = e.target.value;
    setotp(otp);

    if (otp.length === 6 && phno.valid) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // User signed in successfully.
          console.log(otp, " verified");
          const currentUser = result.user;
          console.log(currentUser);
          setotpreq(false);
          setphnostatus({ msg: "OTP verified successfully!", type: "success" });
          setTimeout(() => {
            setphnostatus({ msg: "", type: "success" });
          }, 10000);
          // ...
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
          console.log(otp, "wrong verified");
          setphnostatus({
            msg: "Wrong OTP verified! Please check the OTP  recived by the given phone number",
            type: "error",
          });
        });
    }
  };
  return (
    <div className="home-agenda section-container">
      <div className="home-max-width2 max-content-container">
        <div className="auth-heading-main">
          <h1 className="home-text11 heading2">Sign Up/Log In</h1>
        </div>
        <div className="auth-body" style={{ width: "100%" }}>
          <div className="auth-body-left">
            <p>Welcome to ChatLux</p>
            <p>
              Welcome to ChatLux, the ultimate destination for online chatting!
              Whether you're here to connect with friends, meet new people, or
              simply have a great time, our platform offers a seamless and
              enjoyable chatting experience. With ChatLux, you can create a
              personalized profile, join group conversations, and enjoy private
              messaging with ease. So what are you waiting for? Sign up today
              and start exploring the exciting world of ChatLux!
            </p>
          </div>
          <div className="auth-body-middle" />
          <div className="auth-body-right">
            <div style={{ width: "100%" }}>
              <form className="auth-form">
                <div className="field">
                  <label htmlFor="phno">
                    Phone Number<span className="required-star">*</span>
                  </label>
                  <br />
                  <PhoneNumber
                    value={phno}
                    setValue={handleChangePhno}
                    inputProps={{
                      disabled: loginstate,
                      name: "phno",
                      required: true,
                    }}
                  />
                  {/* <input
                type="text"
                onChange={(e) => {
                  handleChangePhno(e);
                  setotpreq(false);
                  setphnostatus({ msg: "", type: "success" });
                }}
                disabled={loginstate}
                value={phno.phone}
                name="phno"
                id="phno"
                placeholder="Phone Number (+91...)"
                required
              /> */}

                  {!otpreq && !loginstate && (
                    <button type="button" id="otpbutton" onClick={requestOTP}>
                      Request OTP
                    </button>
                  )}
                  {otpreq && (
                    <input
                      type="number"
                      value={otp}
                      onChange={verifyOTP}
                      placeholder="Enter OTP"
                      className="otpinput"
                    />
                  )}
                  {phnostatus.msg && (
                    <Alert variant="filled" severity={phnostatus.type}>
                      {phnostatus.msg}
                    </Alert>
                  )}
                </div>
                <div id="recaptcha-container"></div>
                {Boolean(currentUser) ? (
                  currentUser.displayName ? (
                    <Navigate to="/" state={{ from: location }} replace />
                  ) : (
                    <div className="field" id="namediv">
                      <br />
                      <TextField
                        id="standard-basic"
                        type="text"
                        maxLength="30"
                        name="fullname"
                        onChange={handleChangeFullname}
                        value={fullname}
                        // id="fullname"
                        placeholder="Full Name..."
                        autoFocus
                        required
                        label="Full Name"
                        variant="standard"
                      />
                      <br />
                      <div className="profile-photo-input">
                        <label htmlFor="file">
                          {/* <img src={Add} alt="" /> */}
                          <span>Add an avatar</span>
                        </label>
                        <input
                          required
                          // style={{ display: "none" }}
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </div>
                      <br />
                      {/* <input
                        type="text"
                        maxLength="30"
                        name="fullname"
                        onChange={handleChangeFullname}
                        value={fullname}
                        id="fullname"
                        placeholder="Full Name..."
                        autoFocus
                        required
                      /> */}
                      <button className="submit-btn" onClick={handleNameSubmit}>
                        Submit
                      </button>
                    </div>
                  )
                ) : (
                  <></>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
