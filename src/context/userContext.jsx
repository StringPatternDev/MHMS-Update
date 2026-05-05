import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null); // raw auth user
  const [currentUser, setCurrentUser] = useState(null);   // profile from Firestore
  const [isDoctor, setIsDoctor] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loggedIn, setLoggedIN] = useState(false);

  // Watch Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIN(user ? true : false);
      setFirebaseUser(user || null);
      setCurrentUser(null);
      setContacts([]);
      setIsDoctor(false);
      setLoadingProfile(true);
      setLoadingContacts(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch profile based on firebaseUser
  useEffect(() => {
    if (!firebaseUser) return;

    const fetchProfile = async () => {
      try {
        let role = firebaseUser.email?.endsWith("@doctor.com")
          ? "doctor"
          : "user";

        setIsDoctor(role === "doctor");

        // Check correct collection
        const col = role === "doctor" ? "doctors" : "users";
        const ref = doc(db, col, firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCurrentUser({ id: firebaseUser.uid, ...snap.data() });
        } else {
          console.warn("No profile found in Firestore for:", firebaseUser.uid);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [firebaseUser]);

  // Fetch opposite group as contacts
  useEffect(() => {
    if (!firebaseUser) return;

    let unsubscribe = () => {};
    const col = isDoctor ? "users" : "doctors";

    unsubscribe = onSnapshot(
      collection(db, col),
      (snapshot) => {
        setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingContacts(false);
      },
      (error) => {
        console.error("Error fetching contacts:", error);
        setLoadingContacts(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser, isDoctor]);

  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        currentUser,
        isDoctor,
        contacts,
        loadingProfile,
        loadingContacts,
        loggedIn
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
