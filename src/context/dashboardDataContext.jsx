import React, { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
  increment
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./userContext";

const DashboardDataContext = createContext();
export const useDashboardData = () => useContext(DashboardDataContext);

export const DashboardDataProvider = ({ children }) => {
  const { firebaseUser, isDoctor, currentUser } = useUser();

  /* ================= UI STATE ================= */
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ================= VITALS STATE ================= */
  const [dailyVitals, setDailyVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(false);

  /* 🔑 Whose data is currently loaded */
  const [activeUserId, setActiveUserId] = useState(null);

  /* ================= PROFILE EDIT ================= */

  const openEditDialog = () => setEditOpen(true);
  const closeEditDialog = () => setEditOpen(false);

  const updateDashboardProfile = async (updatedData) => {
    if (!firebaseUser || !currentUser) return;

    try {
      setSaving(true);
      setError(null);

      const col = isDoctor ? "doctors" : "users";
      await updateDoc(doc(db, col, firebaseUser.uid), {
        name: updatedData.name,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber
      });

      closeEditDialog();
    } catch (err) {
      setError("Profile update failed");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ================= SAVE DAILY VITAL ================= */

  const saveVital = async (summary) => {
    if (!firebaseUser || isDoctor) return;

    const dateKey = new Date().toISOString().split("T")[0];
    const ref = doc(db, "users", firebaseUser.uid, "dailyVitals", dateKey);

    const isStressed = summary.prediction !== 1;

    await setDoc(
      ref,
      {
        date: dateKey,
        totalChecks: increment(1),
        stressedCount: increment(isStressed ? 1 : 0),
        notStressedCount: increment(isStressed ? 0 : 1),
        lastUpdated: serverTimestamp()
      },
      { merge: true }
    );
  };

  /* ================= LOAD VITALS FOR ANY USER ================= */

  const loadVitalsForUser = (userId) => {
    if (!userId) return;

    setLoadingVitals(true);
    setActiveUserId(userId);

    const ref = collection(db, "users", userId, "dailyVitals");
    const q = query(ref, orderBy("date", "desc"), limit(10));

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse(); // oldest → newest

      setDailyVitals(data);
      console.log(data);
      setLoadingVitals(false);
    });
  };

  /* ================= AUTO‑LOAD OWN DATA FOR PATIENT ================= */

  useEffect(() => {
    if (!firebaseUser || isDoctor) return;

    const unsubscribe = loadVitalsForUser(firebaseUser.uid);
    return () => unsubscribe && unsubscribe();
  }, [firebaseUser, isDoctor]);

  /* ================= CONTEXT EXPOSURE ================= */

  return (
    <DashboardDataContext.Provider
      value={{
        /* profile */
        editOpen,
        saving,
        error,
        openEditDialog,
        closeEditDialog,
        updateDashboardProfile,

        /* vitals */
        dailyVitals,
        loadingVitals,
        saveVital,

        /* doctor action */
        loadVitalsForUser,
        activeUserId
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};