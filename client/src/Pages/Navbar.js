import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import cLogo from './img/CHAVY.png';

function Navbar() {
  const location = useLocation();
  const hideLogoutButton = ['/', '/Login'].includes(location.pathname);
  const navigate = useNavigate();

  const handleLogout = () => {
    // handle logout logic here
    navigate("/Login");
  };

  const listStyle = {
    listStyleType: 'none',
    listStyleImage: `url(${cLogo})`,
    paddingLeft: '20px',
  };

  return (
    <nav>
      <ul style={listStyle}>
        {!hideLogoutButton && (
          <li>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
