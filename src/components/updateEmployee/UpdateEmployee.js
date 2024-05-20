import React, { useState } from 'react';
import { updateEmployee, getManagerName } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './UpdateEmployee.css';

const UpdateEmployee = ({ onClose, branchId, employeeNumber, currentEmployeeData }) => {
  const [employeeData, setEmployeeData] = useState(currentEmployeeData);
  const [updatedFields, setUpdatedFields] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateEmployee = async () => {
    if (updatedFields.managerNumber == employeeNumber) {
      setErrorMessage("An employee cannot be his own manager.");
      return;
    }

    const updatedEmployeeData = { ...employeeData };

    // Only update fields that have been changed by the user
    Object.keys(updatedFields).forEach((key) => {
      updatedEmployeeData[key] = updatedFields[key];
    });

    // Update the manager name if the manager number was changed
    if (updatedFields.managerNumber !== undefined) {
      if (updatedFields.managerNumber == 0) {
        updatedEmployeeData.head = true;
        updatedEmployeeData.managerName = "None";
      } else {
        updatedEmployeeData.managerName = await getManagerName(updatedFields.managerNumber, branchId);
      }
    }

    // Update the position ID if the position was changed
    if (updatedFields.position !== undefined) {
      updatedEmployeeData.positionID = updatedFields.position.replace(/\s+/g, '');
    }

    const result = await updateEmployee(branchId, employeeNumber, updatedEmployeeData);
    if (result.success) {
      onClose();
    } else {
      setErrorMessage("Could not update employee data.");
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="update-employee-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Update employee
        </Typography>
        {errorMessage && (
          <Typography variant="body2" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <TextField
          label="Name"
          name="name"
          defaultValue={employeeData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Surname"
          name="surname"
          defaultValue={employeeData.surname}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Birth Date"
          name="birthDate"
          defaultValue={employeeData.birthDate}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          defaultValue={employeeData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Manager Number"
          name="managerNumber"
          defaultValue={employeeData.managerNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Position name"
          name="position"
          defaultValue={employeeData.position}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Salary"
          name="salary"
          defaultValue={employeeData.salary}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleUpdateEmployee} fullWidth>
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

export default UpdateEmployee;