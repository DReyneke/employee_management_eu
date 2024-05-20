import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BranchView from './pages/BranchView';
import EmployeeView from './pages/EmployeeView';
import ActivationPage from './pages/ActivationPage';
import ManageEmployees from './pages/ManageEmployees';
import ManageBranches from './pages/ManageBranches';

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/branchView" element={<BranchView />} />
            <Route path="/employeeView/:branchId" element={<EmployeeView />} />
            <Route path="/activate" element={<ActivationPage />} />
            <Route path="/manageEmployees" element={<ManageEmployees />} />
            <Route path="/manageBranches" element={<ManageBranches />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;