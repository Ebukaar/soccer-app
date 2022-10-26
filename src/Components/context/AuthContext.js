import { createContext, useContext, useEffect, useState } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// OnAuthStateChanged checks to see if we are logged in.This makes using protected routes easier.
import { auth } from '../firebase-config'
const UserContext = createContext()



export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    };

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            // console.log(currentUser)
            setUser(currentUser)
        })
        return () => {
            unsubscribe ();
        }
    }, [])
    return (
        <UserContext.Provider value={{createUser, user, logout, signIn}}>
            {children}
        </UserContext.Provider>
    )

}



// This will make our context available through out our application
export const UserAuth = () => {
    return useContext(UserContext)
}
