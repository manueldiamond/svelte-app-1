// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";
import type { UserData } from "./types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import {
  PUBLIC_FIREBASE_API_KEY as apiKey,
  PUBLIC_FIREBASE_AUTH_DOMAIN as authDomain,
  PUBLIC_FIREBASE_PROJECT_ID as projectId,
  PUBLIC_FIREBASE_STORAGE_BUCKET as storageBucket,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID as messagingSenderId,
  PUBLIC_FIREBASE_APP_ID as appId,
  PUBLIC_FIREBASE_MEASUREMENT_ID as measurementId
} from '$env/static/public';

export const ssr=false

const firebaseConfig = {
apiKey,
authDomain,
projectId,
storageBucket,
messagingSenderId,
appId,
measurementId
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

export const userData:Readable<UserData|null> = derived(user,($user,set)=>{
  if($user){
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set)
  }else{
    set(null);
  }
})

