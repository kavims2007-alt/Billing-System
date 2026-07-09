import React from 'react';

export default function Header({ title, description }) {
  const logoSrc = 'C:/Users/kk123/OneDrive/Desktop/textcsc/my-frist-react-app/src/logo.png';

  return (
    <div className="header">
      <div className="header-top">
        <img
          src={logoSrc}
          alt="App logo"
          className="app-logo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = appLogo;
          }}
        />
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
