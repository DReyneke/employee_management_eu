import React, { useState } from "react";
import { Avatar, Box } from "@mui/material";
import ReactDOM from 'react-dom';
import EmployeeInfo from "../employeeInfo/EmployeeInfo";
import UpdateEmployee from "../updateEmployee/UpdateEmployee";
import { getGravatarUrl } from "../../utils/gravatar";
import "./EmployeeNode.css";

const EmployeeNode = ({ nodeDatum }) => {
  const [hover, setHover] = useState(false);
  const employee = nodeDatum.employee;
  const avatarUrl = getGravatarUrl(employee.email);

  const [showUpdateEmployee, setShowUpdateEmployee] = useState(false);

  const handleUpdateEmployeeClick = () => {
    setShowUpdateEmployee(true);
  };

  const handleCloseUpdateEmployee = () => {
    setShowUpdateEmployee(false);
  };

  const avatarStyle = {
    width: "100%",
    height: "100%",
  };

  const infoStyle = {
    zIndex: "500",
    top: "50%",
  };

  return (
    <>
      <foreignObject width="4rem" height="4rem" overflow="visible">
        <Box
          className="employee-node"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          position="relative"
          onClick={handleUpdateEmployeeClick}
        >
          <Avatar
            src={avatarUrl}
            alt={employee.name}
            className="employee-avatar"
            style={avatarStyle}
          />
          {hover && <EmployeeInfo employee={employee} style={infoStyle}/>}
        </Box>
      </foreignObject>
      {showUpdateEmployee && ReactDOM.createPortal(
        <UpdateEmployee onClose={handleCloseUpdateEmployee} branchId={employee.branchId} employeeNumber={employee.employeeNumber} currentEmployeeData={employee} />,
        document.body
      )}
    </>
  );
};

export default EmployeeNode;
