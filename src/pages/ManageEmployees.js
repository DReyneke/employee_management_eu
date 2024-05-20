import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { getBranches, getEmployeesForBranch } from "../utils/firebaseUtils";
import AddEmployee from "../components/addEmployee/AddEmployee";
import RemoveEmployee from "../components/removeEmployee/RemoveEmployee";
import UpdateEmployee from "../components/updateEmployee/UpdateEmployee";
import SearchEmployee from "../components/searchEmployee/SearchEmployee"; // Import SearchEmployee component
import "./ManageEmployees.css";

const ManageEmployees = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, email, name, surname, employeeNumber, position } = location.state;

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showRemoveEmployee, setShowRemoveEmployee] = useState(false);
  const [showUpdateEmployee, setShowUpdateEmployee] = useState(false);
  const [showSearchEmployee, setShowSearchEmployee] = useState(false); // State for SearchEmployee
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchBranches = async () => {
      const branchesData = await getBranches();
      setBranches(branchesData);
    };
    fetchBranches();
  }, []);

  const handleBranchChange = async (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    if (branchId) {
      setLoading(true);
      const employeesData = await getEmployeesForBranch(branchId);
      setEmployees(employeesData);
      setLoading(false);
    }
  };

  const handleAddEmployeeClick = () => {
    setShowAddEmployee(true);
  };

  const handleCloseAddEmployee = () => {
    setShowAddEmployee(false);
  };

  const handleRemoveEmployeeClick = () => {
    setShowRemoveEmployee(true);
  };

  const handleCloseRemoveEmployee = () => {
    setShowRemoveEmployee(false);
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setShowUpdateEmployee(true);
  };

  const handleCloseUpdateEmployee = () => {
    setShowUpdateEmployee(false);
    setSelectedEmployee(null);
  };

  const handleSearchClick = () => {
    setShowSearchEmployee(true);
  };

  const handleCloseSearchEmployee = () => {
    setShowSearchEmployee(false);
  };

  const handleHeaderClick = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="manage-employees">
      <Sidebar user={{ user, role, email, name, surname, employeeNumber, position }} />
      <div className="content">
        <div className="header">
          <select onChange={handleBranchChange} value={selectedBranch}>
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <button className="search-button" onClick={handleSearchClick}>Search</button>
          {selectedBranch && (
            <div className="actions">
              <button className="add-button" onClick={handleAddEmployeeClick}>+</button>
              <button className="remove-button" onClick={handleRemoveEmployeeClick}>-</button>
            </div>
          )}
        </div>
        {selectedBranch ? (
          <div className="employee-table">
            {loading ? (
              <div className="loading-style">
                <div className="dotted-spinner"></div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleHeaderClick('employeeNumber')}>Employee Number</th>
                    <th onClick={() => handleHeaderClick('name')}>Name</th>
                    <th onClick={() => handleHeaderClick('surname')}>Surname</th>
                    <th onClick={() => handleHeaderClick('email')}>Email</th>
                    <th onClick={() => handleHeaderClick('birthDate')}>Birth Date</th>
                    <th onClick={() => handleHeaderClick('managerName')}>Manager Name</th>
                    <th onClick={() => handleHeaderClick('managerNumber')}>Manager Number</th>
                    <th onClick={() => handleHeaderClick('head')}>Head</th>
                    <th onClick={() => handleHeaderClick('position')}>Position</th>
                    <th onClick={() => handleHeaderClick('positionID')}>Position ID</th>
                    <th onClick={() => handleHeaderClick('salary')}>Salary</th>
                    <th onClick={() => handleHeaderClick('branchId')}>Branch ID</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees.map((employee) => (
                    <tr key={employee.employeeNumber} onClick={() => handleRowClick(employee)}>
                      <td>{employee.employeeNumber}</td>
                      <td>{employee.name}</td>
                      <td>{employee.surname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.birthDate}</td>
                      <td>{employee.managerName}</td>
                      <td>{employee.managerNumber}</td>
                      <td>{employee.head ? "Yes" : "No"}</td>
                      <td>{employee.position}</td>
                      <td>{employee.positionID}</td>
                      <td>{employee.salary}</td>
                      <td>{employee.branchId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="message">
            <p>Please choose a branch.</p>
          </div>
        )}
      </div>
      {showAddEmployee && (
        <AddEmployee onClose={handleCloseAddEmployee} branchId={selectedBranch} />
      )}
      {showRemoveEmployee && (
        <RemoveEmployee onClose={handleCloseRemoveEmployee} branchId={selectedBranch} />
      )}
      {showUpdateEmployee && selectedEmployee && (
        <UpdateEmployee
          onClose={handleCloseUpdateEmployee}
          branchId={selectedBranch}
          employeeNumber={selectedEmployee.employeeNumber}
          currentEmployeeData={selectedEmployee}
        />
      )}
      {showSearchEmployee && (
        <SearchEmployee 
          onClose={handleCloseSearchEmployee} 
          branchId={selectedBranch} 
          setEmployees={setEmployees} 
        />
      )}
    </div>
  );
};

export default ManageEmployees;