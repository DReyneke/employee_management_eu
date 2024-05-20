import React, { useState } from 'react';
import { removeBranch } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './RemoveBranch.css';

const RemoveBranch = ({ onClose, setBranches }) => {
  const [branchId, setBranchId] = useState('');

  const handleRemoveBranch = async () => {
    await removeBranch(branchId);
    setBranches(prevBranches => prevBranches.filter(branch => branch.id !== branchId));
    setBranchId('');
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="remove-branch-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Remove Branch
        </Typography>
        <TextField
          label="Branch ID"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleRemoveBranch} fullWidth>
          Remove Branch
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

export default RemoveBranch;