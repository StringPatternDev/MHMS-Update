import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useUser } from "../../context/userContext";
  import { useDashboardData } from "../../context/dashboardDataContext";
  
  const EditProfileDialog = () => {
    const { currentUser } = useUser();
    const {
      editOpen,
      closeEditDialog,
      updateDashboardProfile,
      saving
    } = useDashboardData();
  
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phoneNumber: ""
    });
  
    useEffect(() => {
      if (currentUser && editOpen) {
        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phoneNumber: currentUser.phoneNumber || ""
        });
      }
    }, [currentUser, editOpen]);
  
    const handleChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };
  
    const handleSave = async () => {
      await updateDashboardProfile(formData);
    };
  
    return (
      <Dialog open={editOpen} onClose={closeEditDialog} fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
  
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            margin="dense"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            margin="dense"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            margin="dense"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </DialogContent>
  
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditProfileDialog;