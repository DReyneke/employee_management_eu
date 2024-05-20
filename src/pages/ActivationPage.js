import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activateAccount } from '../utils/authUtils';
import logo from '../assets/logo.png';
import './ActivationPage.css';

const ActivationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleActivate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const result = await activateAccount(email, password);
    if (result.success) {
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
      setError(result.message);
    }
  };

  return (
    <div className="activation-page">
      <div className="card">
        <img src={logo} alt="Company Logo" className="logo" />
        <h1>Activate Your Account</h1>
        <form onSubmit={handleActivate}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Activate Account</button>
        </form>
        <p className="activation-link">
          <a href="/">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ActivationPage;