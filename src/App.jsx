import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./Principal";
import Registro from "./Register";
import Login from "./Login";
import Bienvenida from "./Bienvenida";
import AdminDashboard from "./AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Principal" element={<Principal />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Bienvenida" element={<Bienvenida />} />
        <Route path="/Admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
