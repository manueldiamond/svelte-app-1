// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const ssr=false
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
// const analytics = getAnalytics(app);
const DB = getFirestore();
const auth = getAuth();
const storage = getStorage();



export {app, DB, auth, storage}

function userStore() {
  let unsubscribe:()=>void;
  if(!auth || !(globalThis?.window)){
    console.warn("Auth is not initialized or not in browser")
    const {subscribe} = writable<User|null>(null)
    return {subscribe}
  }

  const {subscribe} = writable(auth.currentUser??null,set=>{
    unsubscribe = onAuthStateChanged(auth,user=>set(user))
    return ()=>unsubscribe()
  })
  return {subscribe}
}

export const user = userStore()

function docStore<T>(path:string){
  const docRef=doc(DB,path)
  
  const {subscribe}=writable<T|null>(null,set=>{
    const unsub = onSnapshot(docRef,(snap)=>{
      set((snap.data() as T)??null)
    })
    return unsub
  })

  return {subscribe,ref:docRef,id:docRef.id}
}

export interface UserLink{
  title:string,
  url:string,
  icon:string
}
export interface UserData{
  username:string,
  photoURL?:string|null,
  published?:boolean;
  bio:string,
  links: UserLink[]
}
export const userData:Readable<UserData|null> = derived(user,($user,set)=>{
  if($user){
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set)
  }else{
    set(null);
  }
})