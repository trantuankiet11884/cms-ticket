import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZzjAVqw9diCy9JcO5eCeOsFYzpX_eZA0",
  authDomain: "cms-ticket-10fcc.firebaseapp.com",
  projectId: "cms-ticket-10fcc",
  storageBucket: "cms-ticket-10fcc.appspot.com",
  messagingSenderId: "494433819007",
  appId: "1:494433819007:web:b56d79e97ff5b24411a24a",
  measurementId: "G-KLZDRBBWZW",
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export default firebase;
