import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./components/Layout";
import NoPage from "./components/NoPage";
import ChatHome from "./components/ChatHome";
import LoginSignUp from "./components/LoginSignUp";
import RequireAuth from "./components/RequireAuth";
import Cssimage from "./components/cssimage/Cssimage";

function App() {
  return (
    <>
      {/* <React.StrictMode> */}
      <BrowserRouter>
        <div className="home-container">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<RequireAuth />}>
                <Route index element={<ChatHome />} />
              </Route>
              <Route path="auth" element={<LoginSignUp />} />
              <Route path="cssimage" element={<Cssimage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
      {/* </React.StrictMode> */}
    </>
  );
}

export default App;
