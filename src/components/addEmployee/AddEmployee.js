import React, { useState } from 'react';
import { addEmployee, getManagerName } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './AddEmployee.css';

const AddEmployee = ({ onClose, branchId }) => {
  const [employeeData, setEmployeeData] = useState({
    birthDate: '',
    branchId: branchId,
    email: '',
    employeeNumber: '',
    managerName: '',
    managerNumber: '',
    head: false,
    name: '',
    position: '',
    positionID: '',
    salary: '',
    surname: ''
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddEmployee = async () => {
    if (employeeData.managerNumber == employeeData.employeeNumber) {
      setErrorMessage("An employee cannot be their own manager.");
      return;
    }

    employeeData.positionID = employeeData.position.replace(/\s+/g, ''); 

    if (employeeData.managerNumber == 0){
      employeeData.head = true;
      employeeData.managerName = "None";
    } else {
      employeeData.managerName = await getManagerName(employeeData.managerNumber, branchId);
    }

    const result = await addEmployee(branchId, employeeData);
    if (result.success) {
      setEmployeeData({
        birthDate: '',
        branchId: branchId,
        email: '',
        employeeNumber: '',
        managerName: '',
        managerNumber: '',
        head: false,
        name: '',
        position: '',
        positionID: '',
        salary: '',
        surname: ''
      });
      onClose();
    } else {
      setErrorMessage("Could not add employee data.");
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="add-employee-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add a new employee
        </Typography>
        {errorMessage && (
          <Typography variant="body2" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <TextField
          label="Name"
          name="name"
          value={employeeData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Surname"
          name="surname"
          value={employeeData.surname}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Birth Date"
          name="birthDate"
          value={employeeData.birthDate}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={employeeData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Employee Number"
          name="employeeNumber"
          value={employeeData.employeeNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Manager Number"
          name="managerNumber"
          value={employeeData.managerNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Position name"
          name="position"
          value={employeeData.position}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Salary"
          name="salary"
          value={employeeData.salary}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddEmployee} fullWidth>
          Add Employee
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

export default AddEmployee;