import React, { useState, useContext } from "react";
import "./search.css";
import AuthContext from "../context/auth/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../base";
import { useTheme } from "../context/theme/ThemeState";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { theme } = useTheme();

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    console.log("hello");
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log("hello1");

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("hello2");

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log("hello error", err);
    }

    setUser(null);
    setUsername("");
  };
  console.log({ user, username, err });
  return (
    <>
      <div
        className="chathome-left-searchbox-div">
        <input
          type="text"
          className={
            "chathome-left-searchbox " +
            (theme === "dark" ? "chathome-left-searchbox-dark" : "")
          }
          placeholder="Search"
          onFocus={() =>
            document.getElementById("dropdown-content").classList.toggle("show")
          }
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <div className="dropdown-content" id="dropdown-content">
          {user ? (
            <div onClick={handleSelect}>{user.displayName}</div>
          ) : (
            <div style={{ color: "grey" }}>
              No Results Found. Press Enter to search
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
