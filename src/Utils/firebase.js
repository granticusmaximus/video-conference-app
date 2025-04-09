// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqG2quT5MNZR_nR7uR7w__yFVXXHU2mbQ",
  authDomain: "blitzchat-ef641.firebaseapp.com",
  projectId: "blitzchat-ef641",
  storageBucket: "blitzchat-ef641.appspot.com",  // ✅ This was previously incorrect
  messagingSenderId: "262342976464",
  appId: "1:262342976464:web:c2c2c4ee2764119277cfd5",
  measurementId: "G-EMVZY2C90X"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };