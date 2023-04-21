import React, {useEffect} from "react";
import { auth, app } from "./base";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { useAuth } from "./context/auth/AuthState";

const NoPage = () => {
  let { currentUser } = useAuth();
  function handlesignout() {
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
  // useEffect(() => {
  //   handlesignout()
  // }, [])
  
    return <>
    <main className="home-main" style={{paddingTop: "200px"}}>
        <div className="home-agenda section-container">
          <div className="home-max-width2 max-content-container">
            <div className="home-heading-container1">
              <h1 className="home-text11 heading2">404 Page Not Found</h1>
            </div>
          </div>
        </div>
      </main>
  </>;
  };
  
export default NoPage;