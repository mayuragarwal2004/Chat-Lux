import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthState";
import { ChatContext } from "../context/chat/ChatContext";
import { db } from "../base";
import { useTheme } from "../context/theme/ThemeState";

const ContactCard = () => {
  const [chats, setChats] = useState([]);
  const { theme } = useTheme();

  const { currentUser } = useAuth();
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
console.log(chats);
  return (
    <>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className={
              "chathome-left-contacts-card-parent " +
              (theme === "dark"
                ? "chathome-left-contacts-card-parent-dark"
                : "")
            }
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <div className="chathome-left-contacts-card">
              <div className="chathome-left-contacts-card-profile-photo">
                <img
                  src={chat[1].userInfo.photoURL}
                  alt="missing"
                  className="chathome-left-contacts-card-profile-photo-img"
                />
              </div>
              <div className="chathome-left-contacts-card-name-lastmsg">
                <div
                  className={
                    "chathome-left-contacts-card-name " +
                    (theme === "dark"
                      ? "chathome-left-contacts-card-name-dark"
                      : "")
                  }
                >
                  {chat[1].userInfo?.displayName}
                </div>
                <div className="chathome-left-contacts-card-lastmsg">
                  {chat[1].lastMessage?.text}
                </div>
              </div>
            </div>
            <div className="chathome-left-contacts-card-time">
              <div className="chathome-left-contacts-card-time-main">
                {new Date(chat[1]?.date?.seconds).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ContactCard;
