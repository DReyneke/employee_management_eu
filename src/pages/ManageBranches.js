import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { getBranches, removeBranch } from "../utils/firebaseUtils";
import AddBranch from "../components/addBranch/AddBranch";
import RemoveBranch from "../components/removeBranch/RemoveBranch";
import SearchBranch from "../components/searchBranch/SearchBranch";
import UpdateBranch from "../components/updateBranch/UpdateBranch";
import "./ManageBranches.css";

const ManageBranches = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, email, name, surname, employeeNumber, position } = location.state;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showRemoveBranch, setShowRemoveBranch] = useState(false);
  const [showSearchBranch, setShowSearchBranch] = useState(false);
  const [showUpdateBranch, setShowUpdateBranch] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      const branchesData = await getBranches();
      setBranches(branchesData);
      setLoading(false);
    };
    fetchBranches();
  }, [reload]);

  const handleAddBranchClick = () => {
    setShowAddBranch(true);
  };

  const handleCloseAddBranch = () => {
    setShowAddBranch(false);
    setReload(!reload);
  };

  const handleRemoveBranchClick = () => {
    setShowRemoveBranch(true);
  };

  const handleCloseRemoveBranch = () => {
    setShowRemoveBranch(false);
    setReload(!reload);
  };

  const handleSearchClick = () => {
    setShowSearchBranch(true);
  };

  const handleCloseSearchBranch = () => {
    setShowSearchBranch(false);
  };

  const handleRowClick = (branch) => {
    setSelectedBranch(branch);
    setShowUpdateBranch(true);
  };

  const handleCloseUpdateBranch = () => {
    setShowUpdateBranch(false);
    setSelectedBranch(null);
    setReload(!reload);
  };

  return (
    <div className="manage-branches">
      <Sidebar user={{ user, role, email, name, surname, employeeNumber, position }} />
      <div className="content">
        <div className="header">
          <button className="search-button" onClick={handleSearchClick}>Search</button>
          <div className="actions">
            <button className="add-button" onClick={handleAddBranchClick}>+</button>
            <button className="remove-button" onClick={handleRemoveBranchClick}>-</button>
          </div>
        </div>
        {loading ? (
          <div className="loading-style">
            <div className="dotted-spinner"></div>
          </div>
        ) : (
          <div className="branch-table">
            <table>
              <thead>
                <tr>
                  <th>Branch ID</th>
                  <th>Branch Name</th>
                  <th>Branch Location</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} onClick={() => handleRowClick(branch)}>
                    <td>{branch.id}</td>
                    <td>{branch.name}</td>
                    <td>{branch.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showAddBranch && <AddBranch onClose={handleCloseAddBranch} />}
      {showRemoveBranch && <RemoveBranch onClose={handleCloseRemoveBranch} setBranches={setBranches} />}
      {showSearchBranch && <SearchBranch onClose={handleCloseSearchBranch} setBranches={setBranches} />}
      {showUpdateBranch && selectedBranch && (
        <UpdateBranch
          onClose={handleCloseUpdateBranch}
          branchId={selectedBranch.id}
          currentBranchData={selectedBranch}
        />
      )}
    </div>
  );
};

export default ManageBranches;