// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';

const NavBar = () => {
  const { userRole } = useAuth();

  return (
    <nav>
      <Link to="/">Inicio</Link>
      {userRole === 'admin' && <Link to="/Admin">Panel de Administrador</Link>}
      {/* Más enlaces según sea necesario */}
    </nav>
  );
};

export default NavBar;





