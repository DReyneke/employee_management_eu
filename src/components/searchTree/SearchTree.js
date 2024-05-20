import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './SearchTree.css';

const SearchTree = ({ onClose, onSearch }) => {
  const [employeeNumber, setEmployeeNumber] = useState('');

  const handleInputChange = (e) => {
    setEmployeeNumber(e.target.value);
  };

  const handleSearch = () => {
    onSearch(employeeNumber);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="search-tree-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Search Employee in Tree
        </Typography>
        <TextField
          label="Employee Number"
          value={employeeNumber}
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

export default SearchTree;