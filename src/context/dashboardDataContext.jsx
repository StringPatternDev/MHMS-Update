import React, { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  increment,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./userContext";

const DashboardDataContext = createContext();
export const useDashboardData = () => useContext(DashboardDataContext);

export const DashboardDataProvider = ({ children }) => {
  const { firebaseUser, isDoctor, currentUser } = useUser();

  /* ---------------- UI STATE ---------------- */
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- DAILY VITALS STATE ---------------- */
  const [dailyVitals, setDailyVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(true);

  /* ================== PROFILE EDIT ================== */

  const openEditDialog = () => setEditOpen(true);
  const closeEditDialog = () => setEditOpen(false);

  const updateDashboardProfile = async (updatedData) => {
    if (!firebaseUser || !currentUser) return;

    try {
      setSaving(true);
      setError(null);

      const collectionName = isDoctor ? "doctors" : "users";
      const ref = doc(db, collectionName, firebaseUser.uid);

      await updateDoc(ref, {
        name: updatedData.name,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber
      });

      closeEditDialog();
    } catch (err) {
      console.error("❌ Profile update failed:", err);
      setError("Failed to update profile");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ================== SAVE DAILY VITAL ================== */

  /**
   * ✅ Called from HeartbeatDisplay when summary is ready
   * ✅ Stores in users/{uid}/dailyVitals/{YYYY-MM-DD}
   * ✅ Atomic + cost‑efficient
   */
  const saveVital = async (summary) => {
    if (!firebaseUser || isDoctor) return;

    try {
      const dateKey = new Date().toISOString().split("T")[0];

      const ref = doc(
        db,
        "users",
        firebaseUser.uid,
        "dailyVitals",
        dateKey
      );

      const isStressed = summary.prediction !== 1;
      console.log(summary.prediction);
      console.log(isStressed);

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

      console.log("✅ Daily vital updated:", dateKey);
    } catch (err) {
      console.error("❌ Error saving daily vital:", err);
    }
  };

  /* ================== FETCH LAST 10 DAYS ================== */

  useEffect(() => {
    if (!firebaseUser || isDoctor) {
      setDailyVitals([]);
      setLoadingVitals(false);
      return;
    }

    const ref = collection(
      db,
      "users",
      firebaseUser.uid,
      "dailyVitals"
    );

    const q = query(
      ref,
      orderBy("date", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .reverse(); // oldest → newest for charts

      setDailyVitals(data);
      setLoadingVitals(false);
    });

    return () => unsubscribe();
  }, [firebaseUser, isDoctor]);

  /* ================== CONTEXT VALUE ================== */

  return (
    <DashboardDataContext.Provider
      value={{
        /* Profile edit */
        editOpen,
        saving,
        error,
        openEditDialog,
        closeEditDialog,
        updateDashboardProfile,

        /* Daily vitals */
        saveVital,
        dailyVitals,
        loadingVitals
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};
