import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAzrNRSET9VrPq3g2yHafbgaA_xvzBeGWo",
    authDomain: "victor-school.firebaseapp.com",
    projectId: "victor-school",
    storageBucket: "victor-school.firebasestorage.app",
    messagingSenderId: "738349110497",
    appId: "1:738349110497:web:289b934c36bb3c6fda13a0",
    measurementId: "G-4HE4JW99MF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Cloud Firestore
export const db = getFirestore(app);

// Analytics
export const analytics = getAnalytics(app);