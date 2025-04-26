// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0YqIHmCch5tFrS4F9eUZw8rYvwAc4pmY",
  authDomain: "barber-app-1a1c3.firebaseapp.com",
  projectId: "barber-app-1a1c3",
  storageBucket: "barber-app-1a1c3.appspot.com",
  messagingSenderId: "282451102538",
  appId: "1:282451102538:web:b9352b3cff5a259e950fb3",
  measurementId: "G-Z13DCGW4M4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
