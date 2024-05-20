import React from 'react';
import './Branch.css';

const Branch = ({ branchId, image, name, location, onClick  }) => {

  const handleClick = () => {
    onClick(branchId);
  };
  return (
    <div className="branch-card" onClick={handleClick}>
      <img src={image} alt={name} className="branch-image" />
      <div className="branch-info">
        <h2 className="branch-name">{name}</h2>
        <p className="branch-location">{location}</p>
      </div>
    </div>
  );
};

export default Branch;