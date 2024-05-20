import React, { useState } from 'react';
import { searchBranches } from '../../utils/firebaseUtils';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './SearchBranch.css';

const SearchBranch = ({ onClose, setBranches }) => {
  const [searchData, setSearchData] = useState({
    branchId: '',
    name: '',
    location: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    const branches = await searchBranches(searchData);
    setBranches(branches);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <Box className="search-branch-card" p={3} bgcolor="white" boxShadow={3} borderRadius={2} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" component="h2" gutterBottom>
          Search Branches
        </Typography>
        <TextField
          label="Branch ID"
          name="branchId"
          value={searchData.branchId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Branch Name"
          name="name"
          value={searchData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Branch Location"
          name="location"
          value={searchData.location}
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

export default SearchBranch;