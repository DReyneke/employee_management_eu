import React, { useState } from 'react';
import { searchEmployees } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './SearchEmployee.css';

const SearchEmployee = ({ onClose, branchId, setEmployees }) => {
  const [searchData, setSearchData] = useState({
    employeeNumber: '',
    name: '',
    surname: '',
    managerName: '',
    positionID: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    const employees = await searchEmployees(branchId, searchData);
    setEmployees(employees);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="search-employee-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Search Employees
        </Typography>
        <TextField
          label="Employee Number"
          name="employeeNumber"
          value={searchData.employeeNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          name="name"
          value={searchData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Surname"
          name="surname"
          value={searchData.surname}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Manager Name"
          name="managerName"
          value={searchData.managerName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Position ID"
          name="positionID"
          value={searchData.positionID}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
          Search
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

export default SearchEmployee;