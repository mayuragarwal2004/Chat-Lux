// import React from "react";
import React, { useContext, createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ThemeContext from "./ThemeContext";
import { auth } from "../../base";

const ThemeState = (props) => {
  const [theme, settheme] = useState(localStorage.getItem("theme") || "light");

  const themechange = () => {
    if (theme === "light") {
      settheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      settheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  const value = { theme, themechange };
  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeState;
