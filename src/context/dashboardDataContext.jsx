import React, { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
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

  /* ---------------- VITALS STATE ---------------- */
  const [vitals, setVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(true);

  /* ================== PROFILE EDIT ================== */

  const openEditDialog = () => {
    console.log("✅ Edit dialog opened");
    setEditOpen(true);
  };

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

  /* ================== SAVE VITAL ================== */

  /**
   * Called from HeartbeatDisplay once summary is ready
   */
  const saveVital = async (summary) => {
    if (!firebaseUser || isDoctor) return;

    try {
      const vitalsRef = collection(
        db,
        "users",
        firebaseUser.uid,
        "vitals"
      );

      await addDoc(vitalsRef, {
        heartRate: summary.heartRate,
        prediction: summary.prediction,
        stressStatus:
          summary.prediction === 1 ? "Not Stressed" : "Stressed",
        createdAt: serverTimestamp()
      });

      console.log("✅ Vital saved to Firestore");
    } catch (err) {
      console.error("❌ Error saving vital:", err);
    }
  };

  /* ================== LIVE VITALS LISTENER ================== */

  useEffect(() => {
    if (!firebaseUser || isDoctor) {
      setVitals([]);
      setLoadingVitals(false);
      return;
    }

    const vitalsRef = collection(
      db,
      "users",
      firebaseUser.uid,
      "vitals"
    );

    const q = query(vitalsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vitalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setVitals(vitalsData);
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

        /* Vitals */
        saveVital,
        vitals,
        loadingVitals
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};