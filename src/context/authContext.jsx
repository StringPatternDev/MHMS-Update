import React, { createContext, useContext } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  // 🔹 Login function
  const login = async (email, password, asDoctor = false) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;

    // validate doctor email if doctor login
    if (asDoctor && !email.endsWith("@doctor.com")) {
      throw new Error("Invalid email for doctor");
    }

    return loggedInUser;
  };

  // 🔹 Signup function
  const signup = async (email, password, name, phoneNumber) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    await setDoc(doc(db, "users", newUser.uid), {
      name,
      email,
      phoneNumber,
      createdAt: serverTimestamp(),
    });

    return newUser;
  };

  // 🔹 Logout function
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
