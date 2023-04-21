import React, { useState, useContext } from "react";
import "./chathome.css";
import { useTheme } from "./context/theme/ThemeState";
import { useAuth } from "./context/auth/AuthState";
import SearchIcon from "@mui/icons-material/Search";
import Search from "./chatComponents/Search";
import ContactCard from "./chatComponents/ContactCard";
import { ChatContext } from "./context/chat/ChatContext";
import Messages from "./chatComponents/Messages";
import MessageInput from "./chatComponents/MessageInput";
import { signOut } from "firebase/auth";
import { auth } from "./base";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Application } from "@splinetool/runtime";

const options = ["Toggle Theme", "Atria", "Callisto", "Dione", "Ganymede"];

const ITEM_HEIGHT = 48;

const Chathome = () => {
  const { theme, themechange } = useTheme();
  const { currentUser } = useAuth();
  const { data } = useContext(ChatContext);
  console.log(theme);
  console.log(currentUser);
  console.log("data.chatId",data.chatId);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  console.log({ data });
  const handleClose = () => {
    setAnchorEl(null);
  };
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
  return (
    <div>
      <div
        className={
          "chathome-main " + (theme === "dark" ? "chathome-main-dark" : "")
        }
      >
        <div
          className={
            "chathome-left-parent " +
            (theme === "dark" ? "chathome-left-parent-dark" : "")
          }
        >
          <div className="chathome-left-child ">
            <div className="chathome-left-useprofile">
              <div className="chathome-left-user-profile-photo">
                <img
                  src={currentUser.photoURL || "avatar.png"}
                  alt="missing"
                  className="chathome-left-user-profile-photo-img"
                />
              </div>
              <div className="chathome-left-user-name-status">
                <div
                  className={
                    "chathome-left-user-name " +
                    (theme === "dark" ? "chathome-left-user-name-dark" : "")
                  }
                >
                  {currentUser.displayName}
                </div>
                <div
                  className={
                    "chathome-left-user-status " +
                    (theme === "dark" ? "chathome-left-user-status-dark" : "")
                  }
                >
                  Status
                </div>
              </div>
              <div>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  sx={{ color: theme === "dark" ? "white" : "" }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      themechange();
                      handleClose();
                    }}
                  >
                    Toggle Theme
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handlesignout();
                      handleClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                  <MenuItem onClick={handleClose}>About</MenuItem>
                  {/* {options.map((option) => (
                  <MenuItem
                    key={option}
                    onClick={handleClose}
                  >
                    {option}
                  </MenuItem>
                ))} */}
                </Menu>
              </div>
            </div>
            <Search />
            <div className="chathome-left-contacts">
              {/* <div className="chathome-left-contacts-card-parent">
              <div className="chathome-left-contacts-card">
                <div className="chathome-left-contacts-card-profile-photo">
                  <img
                    src="avatar.png"
                    alt="missing"
                    className="chathome-left-contacts-card-profile-photo-img"
                  />
                </div>
                <div className="chathome-left-contacts-card-name-lastmsg">
                  <div className="chathome-left-contacts-card-name">
                    Vindhya
                  </div>
                  <div className="chathome-left-contacts-card-lastmsg">
                    How are you?
                  </div>
                </div>
              </div>
              <div className="chathome-left-contacts-card-time">
                <div className="chathome-left-contacts-card-time-main">
                  11:29am
                </div>
              </div>
            </div> */}
              <ContactCard />
            </div>
          </div>
        </div>
        {data.chatId !== "null" ? (
          <div className="chathome-right-parent">
            <div className="chathome-right-header">
              <div className="chathome-right-header-left">
                <div className="chathome-right-header-profile-photo">
                  <img
                    src={data.user.photoURL || "avatar.png"}
                    alt="missing"
                    className="chathome-right-header-profile-photo-img"
                  />
                </div>
                <div className="chathome-right-header-name-status">
                  <div
                    className={
                      "chathome-right-header-name " +
                      (theme === "dark"
                        ? "chathome-right-header-name-dark"
                        : "")
                    }
                  >
                    {data.user?.displayName}
                  </div>
                  <div className="chathome-right-header-status">Online</div>
                </div>
              </div>
              <div className="chathome-right-header-right">
                <SearchIcon sx={{ color: theme === "dark" ? "white" : "" }} />
              </div>
            </div>
            <div className="chathome-right-msgs-footer">
              <div className="chathome-right-msgs">
                <Messages />
              </div>
              <div className="chathome-right-footer">
                <MessageInput />
              </div>
            </div>
          </div>
        ) : (
          <div className="nochatselected">
            <iframe
              title="spline"
              src="https://my.spline.design/3dtextbluecopy-a92f32a5f138371ed9bbef32af8003c0/"
              frameborder="0"
              width="100%"
              height="100%"
            ></iframe>
            {/* Select a chat to continue */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chathome;
