import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Replace with your Firebase project config from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyD2KaJCc4Zg23wEOMiCjEJjvToDXh-mn1k",
  authDomain: "cheatday-29eda.firebaseapp.com",
  projectId: "cheatday-29eda",
  storageBucket: "cheatday-29eda.firebasestorage.app",
  messagingSenderId: "649368500634",
  appId: "1:649368500634:web:37d9cddababb6427092223",
  measurementId: "G-NT773SMQ7F"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
