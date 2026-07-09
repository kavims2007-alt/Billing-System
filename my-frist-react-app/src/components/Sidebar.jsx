import React from 'react';

export default function Sidebar({ menuItems, page, setPage }) {
  return (
    <div className="sidebar">
      <h2>Modules</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={item.key === page ? 'active' : ''}
            onClick={() => setPage(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
