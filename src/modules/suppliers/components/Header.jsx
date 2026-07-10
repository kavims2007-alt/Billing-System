import React from 'react';

export default function Header({ title, description }) {
  return (
    <div className="header">
      <div className="header-top">
        <span className="app-logo" aria-hidden="true">
          <i className="fa-solid fa-truck-field"></i>
        </span>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
