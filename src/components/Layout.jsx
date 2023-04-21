import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Switch from '@mui/material/Switch';
import { useTheme } from "./context/theme/ThemeState";

const Layout = () => {
  const { themechange } = useTheme()
  return (
    <>
      {/* <header>
        this is header
        <Switch defaultChecked onClick={themechange} />
      </header> */}
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
