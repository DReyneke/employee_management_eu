import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import EmployeeNode from "../components/employeeNode/EmployeeNode.js";
import Sidebar from "../components/sidebar/Sidebar.js";
import {
  getRootPosition,
  getManagedPositions,
  getEmployeesByPosition,
} from "../utils/firebaseUtils.js";
import AddEmployee from "../components/addEmployee/AddEmployee.js";
import RemoveEmployee from "../components/removeEmployee/RemoveEmployee.js";
import SearchTree from "../components/searchTree/SearchTree.js";
import Tree from "react-d3-tree";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./EmployeeView.css";

const buildTree = async (branchId) => {
  try {
    const rootPosition = await getRootPosition(branchId);
    const children = [];

    if (!rootPosition) {
      return {};
    }

    const tree = {
      name: rootPosition.positionID,
      attributes: rootPosition,
      children: children,
      employee: rootPosition,
    };

    const addChildren = async (
      childrenIn,
      positionID,
      managerNumber,
      branchId
    ) => {
      var managedPositions = await getManagedPositions(positionID);
      for (const position of managedPositions) {
        var employeesByPosition = await getEmployeesByPosition(branchId, position, managerNumber);
        for (const employee of employeesByPosition) {
          const newChildren = [];
          childrenIn.push({
            name: employee.positionID,
            attributes: employee,
            children: newChildren,
            employee: employee,
          });
          await addChildren(newChildren, employee.positionID, employee.employeeNumber, branchId);
        }
      }
    };

    await addChildren(children, rootPosition.positionID, rootPosition.employeeNumber, branchId);

    return tree;
  } catch (error) {
    console.error("Error building tree: ", error);
    return {};
  }
};

const renderEmployeeNode = ({ nodeDatum, captureNodePosition }) => (
  <g ref={(node) => captureNodePosition(node, nodeDatum)}>
    <EmployeeNode nodeDatum={nodeDatum} />
  </g>
);

const EmployeeView = () => {
  const location = useLocation();
  const { user, role, email, name, surname, employeeNumber, position } = location.state;
  const { branchId } = useParams();
  const treeContainerRef = useRef(null);
  const treeRef = useRef(null); // Add a ref to the Tree component
  const nodeRefs = useRef({}); // Add a ref to store node positions

  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showRemoveEmployee, setShowRemoveEmployee] = useState(false);
  const [showSearchTree, setShowSearchTree] = useState(false);
  const [translate, setTranslate] = useState({ x: 300, y: 50 });
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchTree = async () => {
      const tree = await buildTree(branchId);
      setTreeData(tree);
      setLoading(false);
    };

    fetchTree();
  }, [branchId, reload]);

  // Function to capture node positions
  const captureNodePosition = (node, nodeDatum) => {
    if (node && nodeDatum) {
      const { employeeNumber } = nodeDatum.attributes;
      nodeRefs.current[employeeNumber] = node.getBoundingClientRect();
    }
  };

  const handleAddEmployeeClick = () => {
    setShowAddEmployee(true);
  };

  const handleCloseAddEmployee = () => {
    setShowAddEmployee(false);
    setReload(!reload);
  };

  const handleRemoveEmployeeClick = () => {
    setShowRemoveEmployee(true);
  };

  const handleCloseRemoveEmployee = () => {
    setShowRemoveEmployee(false);
    setReload(!reload);
  };

  const handleSearchTreeClick = () => {
    setShowSearchTree(true);
  };

  const handleCloseSearchTree = () => {
    setShowSearchTree(false);
  };

  const navigateToNode = (targetEmployeeNumber) => {
    const targetNode = nodeRefs.current[targetEmployeeNumber];
    if (targetNode) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      const { left, top } = targetNode;
      setTranslate({
        x: 0 + width/2,
        y: 0 + height/2,
      });
    } else {
      // Flash the search button red for 2 seconds
      const searchButton = document.querySelector(".tree-search-button");
      if (searchButton) {
        searchButton.classList.add("flash-red");
        setTimeout(() => {
          searchButton.classList.remove("flash-red");
        }, 2000);
      }
    }
  };

  return (
    <div className="employee-view">
      <Sidebar user={{ user, role, email, name, surname, employeeNumber, position }}/>
      <div className="branch-info">
        <h2>{branchId}</h2>
      </div>
      <div className="content">
        {loading ? (
          <div className="loading-style">
            <div className="dotted-spinner"></div>
          </div>
        ) : Object.keys(treeData).length === 0 ? (
          <div>
            Please add a head employee of the branch. Set the Manager Number field to 0
          </div>
        ) : (
          <div className="tree-container" ref={treeContainerRef}>
            <Tree
              ref={treeRef} // Add the ref here
              data={treeData}
              orientation="vertical"
              pathFunc="step"
              renderCustomNodeElement={(rd3tProps) => renderEmployeeNode({ ...rd3tProps, captureNodePosition })}
              separation={{ siblings: 1, nonSiblings: 1.2 }}
              translate={translate}
              enableLegacyTransitions
            />
          </div>
        )}
      </div>
      {role === 'admin' && (
        <>
          <button className="add-button" onClick={handleAddEmployeeClick}>
            +
          </button>
          <button className="remove-button" onClick={handleRemoveEmployeeClick}>
            -
          </button>
        </>
      )}
      <button className="tree-search-button" onClick={handleSearchTreeClick}>
        <SearchIcon />
      </button>
      {showAddEmployee && (
        <AddEmployee onClose={handleCloseAddEmployee} branchId={branchId} />
      )}
      {showRemoveEmployee && (
        <RemoveEmployee onClose={handleCloseRemoveEmployee} branchId={branchId} />
      )}
      {showSearchTree && (
        <SearchTree onClose={handleCloseSearchTree} onSearch={navigateToNode} />
      )}
    </div>
  );
};

export default EmployeeView;