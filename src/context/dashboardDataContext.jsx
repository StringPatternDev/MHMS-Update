import React, { createContext, useContext, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./userContext";

const DashboardDataContext = createContext();
export const useDashboardData = () => useContext(DashboardDataContext);

export const DashboardDataProvider = ({ children }) => {
  const { firebaseUser, isDoctor, currentUser } = useUser();

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const openEditDialog = () => {
    console.log("dialog open");
    setEditOpen(true)
  };
  const closeEditDialog = () => setEditOpen(false);

  /**
   * ✅ Update profile ONLY when Save is clicked
   */
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

      // UI will auto‑update because UserContext
      // already has currentUser loaded from Firestore
      closeEditDialog();
    } catch (err) {
      console.error("Dashboard profile update error:", err);
      setError("Failed to update profile");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardDataContext.Provider
      value={{
        editOpen,
        saving,
        error,
        openEditDialog,
        closeEditDialog,
        updateDashboardProfile
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};