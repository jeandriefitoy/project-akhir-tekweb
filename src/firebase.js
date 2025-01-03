// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAwcppAdyUD1bbXxnj__c915_IHo6nQ_A",
    authDomain: "kost-merkid.firebaseapp.com",
    projectId: "kost-merkid",
    storageBucket: "kost-merkid.firebasestorage.app",
    messagingSenderId: "385407502112",
    appId: "1:385407502112:web:6e41583ee90536e61f3945",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);
export { auth };
