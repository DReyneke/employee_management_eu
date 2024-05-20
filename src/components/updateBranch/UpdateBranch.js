import React, { useState } from 'react';
import { updateBranch } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './UpdateBranch.css';

const UpdateBranch = ({ onClose, branchId, currentBranchData }) => {
  const [branchData, setBranchData] = useState(currentBranchData);
  const [updatedFields, setUpdatedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateBranch = async () => {
    const updatedBranchData = { ...branchData };

    // Only update fields that have been changed by the user
    Object.keys(updatedFields).forEach((key) => {
      updatedBranchData[key] = updatedFields[key];
    });

    await updateBranch(branchId, updatedBranchData);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="update-branch-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Update Branch
        </Typography>
        <TextField
          label="Branch Name"
          name="name"
          defaultValue={branchData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Branch Location"
          name="location"
          defaultValue={branchData.location}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleUpdateBranch} fullWidth>
          Confirm Update
        </Button>
        <IconButton
          className="close-button"
          onClick={onClose}
          style={{ position: 'absolute', top: "0.7rem", right: "2%" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default UpdateBranch;