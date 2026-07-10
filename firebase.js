import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7UyefiCWn4QbgwcmTTRMVGpAUtmTR_e8",
  authDomain: "singlepage-pro.firebaseapp.com",
  projectId: "singlepage-pro",
  storageBucket: "singlepage-pro.firebasestorage.app",
  messagingSenderId: "464558018268",
  appId: "1:464558018268:web:5f9705499af000932aae19",
  measurementId: "G-T5TD5RJ56T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };