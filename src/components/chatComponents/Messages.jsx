import React, { useState, useEffect, useContext } from "react";
import { ChatContext } from "../context/chat//ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../base";
import { useAuth } from "../context/auth/AuthState";
import { useTheme } from "../context/theme/ThemeState";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  return (
    <>
      {messages.map((message) => (
        <>
          {message.senderId === currentUser.uid ? (
            <div className="sent-msg-row" key={message.id}>
              <div
                className={
                  "sent-msg " + (theme === "dark" ? "sent-msg-dark" : "")
                }
              >
                <div className="sent-msg-data">
                  {message.text || (
                    <img
                      src={message.img}
                      className="chat-images"
                      alt="Deleted"
                    />
                  )}
                </div>
                <div className="sent-msg-time">
                  {new Date(message.date.seconds).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="recieved-msg-row" key={message.id}>
              <div className={"recieved-msg " + (theme === "dark" ? "recieved-msg-dark" : "")}>
                <div className="recieved-msg-data">
                  {message.text || (
                    <img
                      src={message.img}
                      className="chat-images"
                      alt="Deleted"
                    />
                  )}
                </div>
                <div className="recieved-msg-time">
                  {new Date(message.date.seconds).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </>
      ))}
    </>
  );
};

export default Messages;
