import React, { useState, useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/auth/AuthState";
import { ChatContext } from "../context/chat/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../base";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useTheme } from "../context/theme/ThemeState";

const MessageInput = () => {
  const [text, settext] = useState("");
  const [img, setImg] = useState(null);
  const { theme } = useTheme();

  const fileInput = React.useRef(null);

  const handleImageSelect = (event) => {
    fileInput.current.click();
  };

  const { currentUser } = useAuth();
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (text === "" && img === null) return;
    if (img) {
      console.log("hello 1");
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);
      console.log("hello 2");

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
      console.log("hello 3");
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    settext("");
    setImg(null);
  };

  const handleSendEnter = (e) => {
    e.code === "Enter" && handleSend();
  };
  return (
    <>
      <div className={"chathome-right-footer-message-area "+ (theme==="dark"?"chathome-right-footer-message-area-dark":"")}>
        {/* <input
                type="textarea"
                className="chathome-right-footer-message-area-input"
                placeholder="Enter a message"
              /> */}
        <textarea
          style={{ resize: "none" }}
          placeholder="Enter a message"
          className={"chathome-right-footer-message-area-input "+ (theme==="dark"?"chathome-right-footer-message-area-input-dark":"")}
          max-rows="5"
          value={text}
          onChange={(m) => settext(m.target.value)}
          onKeyDown={handleSendEnter}
        />
        <AttachFileIcon
          className="cursor-pointer"
          onClick={handleImageSelect}
          sx={{ color: "#7BA7D7" }}
        />
        <AddPhotoAlternateIcon
          className="cursor-pointer"
          onClick={handleImageSelect}
          sx={{ color: "#7BA7D7" }}
        />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          ref={fileInput}
          onChange={(e) => setImg(e.target.files[0])}
        />
      </div>
      <div className="Send message">
        <SendIcon
          onClick={handleSend}
          className="send-msg-icon cursor-pointer"
          sx={{ color: "#7BA7D7" }}
        />
      </div>
    </>
  );
};

export default MessageInput;
