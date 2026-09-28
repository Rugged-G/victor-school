// ======================================================
// VICTOR SCHOOL - FIREBASE CONFIGURATION
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyAzrNRSET9VrPq3g2yHafbgaA_xvzBeGWo",
    authDomain: "victor-school.firebaseapp.com",
    projectId: "victor-school",
    storageBucket: "victor-school.firebasestorage.app",
    messagingSenderId: "738349110497",
    appId: "1:738349110497:web:289b934c36bb3c6fda13a0",
    measurementId: "G-4HE4JW99MF"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);


// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================

export const auth = getAuth(app);


// ======================================================
// CLOUD FIRESTORE
// ======================================================

export const db = getFirestore(app);