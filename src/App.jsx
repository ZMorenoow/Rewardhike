import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Principal from "./Principal";
import Registro from "./Register";
import Login from "./Login";
import Bienvenida from "./Bienvenida";
import AdminDashboard from "./AdminDashboard";
import EncargadoLocal from "./EncargadoLocal";
import EncargadoQR from "./EncargadoQR";
import Navbar from "./Navbar";
import { AuthProvider } from "./utils/AuthContext.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <RouteRender />
      </Router>
    </AuthProvider>
  );
};

const RouteRender = () => {
  const location = useLocation();
  const hiddenRoutes = ["/", "/Login", "/Registro"];
  const showNavBar = !hiddenRoutes.includes(location.pathname);

  return (
    <>
      {showNavBar && <Navbar />}
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Bienvenida" element={<Bienvenida />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/EncargadoLocal" element={<EncargadoLocal />} />
        <Route path="/EncargadoQR" element={<EncargadoQR />} />
      </Routes>
    </>
  );
};

export default App;
