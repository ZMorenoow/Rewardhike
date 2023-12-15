import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const login = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
  };

  const checkAuthentication = () => {
    // Aquí debes implementar la lógica para verificar la autenticación.
    // Puedes usar userRole u otros métodos según tu implementación.
    return Boolean(localStorage.getItem("userRole"));
  };

  return (
    <AuthContext.Provider
      value={{ userRole, login, logout, checkAuthentication }}
    >
      {children}
    </AuthContext.Provider>
  );
};
