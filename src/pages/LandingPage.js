import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/authUtils';
import logo from '../assets/logo.png';
import './LandingPage.css';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(email, password);
    if (result) {
      const userState = {
        user: result.user.uid,
        role: result.role,
        email: result.email,
        name: result.name,
        surname: result.surname,
        employeeNumber: result.employeeNumber,
        branchId: result.branchId,
      };
      navigate('/branchView', { state: userState });
    } else {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="landing-page">
      <div className="card">
        <img src={logo} alt="Company Logo" className="logo" />
        <h1>Welcome to the Employee Management System</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Submit</button>
        </form>
        <p className="activation-link">
          <a href="/activate">Activate your account</a>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;