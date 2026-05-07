import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
  } from "@mui/material";
  import ProgressChart from "./ProgressChart";
  
  const ProgressChartDialog = ({ open, onClose }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Patient Progress</DialogTitle>
  
        <DialogContent dividers>
          <ProgressChart />
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ProgressChartDialog;