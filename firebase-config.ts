// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpNDeK_TTfTeaNabop2k7J4Nf2BCUSl-w",
  authDomain: "crossplatform-web-86308.firebaseapp.com",
  projectId: "crossplatform-web-86308",
  storageBucket: "crossplatform-web-86308.appspot.com",
  messagingSenderId: "761662765949",
  appId: "1:761662765949:web:8c115930c2d7b30fdbea14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
