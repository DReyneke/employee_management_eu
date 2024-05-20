import React from 'react';
import { Link } from 'react-router-dom';
// import logo from '../assets/company-logo.png'; // Make sure to add the logo image to the assets folder

const Header = () => {
  return (
    <header style={styles.header}>
      <img  alt="Company Logo" style={styles.logo} />
      <nav>
        <Link to="/" style={styles.link}>Home</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6'
  },
  logo: {
    height: '40px',
    marginRight: '10px'
  },
  link: {
    margin: '0 10px',
    textDecoration: 'none',
    color: '#343a40'
  }
};

export default Header;