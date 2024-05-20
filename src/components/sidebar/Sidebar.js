import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { getGravatarUrl } from '../../utils/gravatar';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const avatarUrl = getGravatarUrl(user.email);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, {
      state: { 
        user: user.user,
        role: user.role,
        email: user.email,
        name: user.name,
        surname: user.surname,
        employeeNumber: user.employeeNumber,
        position: user.position
      }
    });
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <img src={avatarUrl} alt={`${user.name} ${user.surname}`} className="avatar" />
        <div className="user-details">
          <h2>{user.name} {user.surname}</h2>
          <p>{user.employeeNumber}</p>
          <p>{user.position}</p>
        </div>
      </div>
      <nav className="nav-links">
        <button className="nav-link" onClick={() => handleNavigation('/branchView')}>View branches</button>
        {user.role === 'admin' && (
          <>
            <button className="nav-link" onClick={() => handleNavigation('/manageEmployees')}>Manage Employees</button>
            <button className="nav-link" onClick={() => handleNavigation('/manageBranches')}>Manage Branches</button>
          </>
        )}
      </nav>
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo" />
      </div>
    </div>
  );
};

export default Sidebar;