import React, { useState } from 'react';
import { addBranch } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './AddBranch.css';

const AddBranch = ({ onClose }) => {
  const [branchName, setBranchName] = useState('');
  const [branchLocation, setBranchLocation] = useState('');

  const handleAddBranch = async () => {
    const branchId = branchName.replace(/\s+/g, '');
    const newBranch = {
      name: branchName,
      location: branchLocation,
    };
    await addBranch(branchId, newBranch);
    setBranchName('');
    setBranchLocation('');
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="add-branch-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add a new branch
        </Typography>
        <TextField
          label="Branch Name"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Branch Location"
          value={branchLocation}
          onChange={(e) => setBranchLocation(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddBranch} fullWidth>
          Add Branch
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

export default AddBranch;