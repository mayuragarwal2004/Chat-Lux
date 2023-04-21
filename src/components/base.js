// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1tevf2sUEWfqRoi9Rw5rNuEEHHtfszbc",
  authDomain: "chatlux-4f186.firebaseapp.com",
  projectId: "chatlux-4f186",
  storageBucket: "chatlux-4f186.appspot.com",
  messagingSenderId: "1010598671959",
  appId: "1:1010598671959:web:621eb7d5999c2104b91512"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
// const auth = getAuth(app);
// export {db, auth}
