import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from '@firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAaogEl4xDYhDUoZ3Lo-JCclvwmVbqnKdA",
    authDomain: "fir-tutorial-da08f.firebaseapp.com",
    projectId: "fir-tutorial-da08f",
    storageBucket: "fir-tutorial-da08f.appspot.com",
    messagingSenderId: "391943052318",
    appId: "1:391943052318:web:2c04fdb077920160eca20f",
    measurementId: "G-H6NVV7EHYT"
  };


  const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app)
export const  db = getFirestore(app);
export default app