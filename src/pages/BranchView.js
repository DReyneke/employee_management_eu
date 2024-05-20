import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BranchView.css";
import Sidebar from "../components/sidebar/Sidebar.js";
import Branch from "../components/branch/Branch.js";
import AddBranch from "../components/addBranch/AddBranch.js";
import { getBranches } from "../utils/firebaseUtils.js"; // Import to get all the branches
import BranchDefault from "../assets/branch.png";
import { useLocation } from 'react-router-dom'; // Import to get the location state

const BranchView = () => {
  const [branches, setBranches] = useState([]);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Use useLocation to get the passed state
  const navigate = useNavigate(); // Use useNavigate to navigate to different routes
  const { user, role, email, name, surname, employeeNumber, position, branchId } = location.state;

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      const branchesData = await getBranches();
      setBranches(branchesData);
      setLoading(false);
    };

    fetchBranches();
  }, []);

  const handleBranchClick = (branchId) => {
    navigate(`/employeeView/${branchId}`, {
      state: { user, role, email, name, surname, employeeNumber, position }
    });
  };

  const handleAddBranchClick = () => {
    setShowAddBranch(true);
  };

  const handleCloseAddBranch = () => {
    setShowAddBranch(false);
  };

  return (
    <div className="branch-view">
      <Sidebar user={{ user, role, email, name, surname, employeeNumber, position }} />
      <div className="content">
        {loading ? (
          <div className="loading-style">
            <div className="dotted-spinner"></div>
          </div>
        ) : (
          <div className="branch-list">
            {branches.map((branch) => (
              <Branch
                key={branch.id}
                branchId={branch.id}
                image={BranchDefault}
                name={branch.name}
                location={branch.location}
                onClick={handleBranchClick}
              />
            ))}
          </div>
        )}
      </div>
      <button className="add-button" onClick={handleAddBranchClick}>
        +
      </button>
      {showAddBranch ? <AddBranch onClose={handleCloseAddBranch} /> : ""}
    </div>
  );
};

export default BranchView;