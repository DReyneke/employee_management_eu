import React, { useState } from 'react';
import { removeEmployee } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './RemoveEmployee.css';

const RemoveEmployee = ({ onClose, branchId }) => {
  const [employeeNumber, setEmployeeNumber] = useState('');

  const handleInputChange = (e) => {
    setEmployeeNumber(e.target.value);
  };

  const handleRemoveEmployee = async () => {
    await removeEmployee(branchId, employeeNumber);
    setEmployeeNumber('');
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="remove-employee-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Remove an employee
        </Typography>
        <TextField
          label="Employee Number"
          name="employeeNumber"
          value={employeeNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleRemoveEmployee} fullWidth>
          Remove Employee
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

export default RemoveEmployee;