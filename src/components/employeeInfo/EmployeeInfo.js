import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './EmployeeInfo.css';

const EmployeeInfo = ({ employee, style }) => {
  const { name, position } = employee;

  const cardStyle = {
    backgroundColor : "rgba(207, 207, 207, 0.241)",
  }

  return (
    <Card className="employee-card" style={{...cardStyle, ...style}}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box ml={2}>
            <Typography variant="h6" component="div">
              {name} {employee.surname}
            </Typography>
            <Typography variant="h7" component="div">
              {employee.employeeNumber}
            </Typography>
            <Typography color="textSecondary">
              Position: {position}
            </Typography>
            <Typography color="textSecondary">
              Manager: {employee.managerName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeInfo;