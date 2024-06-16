// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2ppMMdBfB0-lPGKxzR7rhf7wsqutR554",
  authDomain: "svelte-ap.firebaseapp.com",
  projectId: "svelte-ap",
  storageBucket: "svelte-ap.appspot.com",
  messagingSenderId: "90730249613",
  appId: "1:90730249613:web:ef7189e63195364cf551c4",
  measurementId: "G-HTF8ZHJ6WN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const DB = getFirestore();
const auth = getAuth();
const storage = getStorage();


export {app, DB, auth, storage}

function userStore() {
  let unsubscribe=()=>void
  const {subscribe} = writable(auth.currentUser??null,set=>{
    unsubscribe = onAuthStateChanged(auth,user=>set(user))
    return ()=>unsubscribe()
  })
  return {subscribe}
}

export const user = userStore()