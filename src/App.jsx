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
import Navbar from "./Navbar";
import { AuthProvider } from "./utils/AuthContext.jsx";
import MapView from "./MapView";
import CuponesAdministrador from "./CuponesAdministrador";
import AdminDashboardUsers from "./AdminDashboardUsers";
import EncargadoLocalEnvioCupon from "./EncargadoLocalEnvioCupon";
import EncargadoLocalListaCupones from "./EncargadoLocalListaCupones";
import EncargadoQRCupones from "./EncargadoQRCupones";
import EncargadoQRListaCodigos from "./EncargadoQRListaCodigos";

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
        <Route path="/MapView" element={<MapView />} />
        <Route
          path="/CuponesAdministrador"
          element={<CuponesAdministrador />}
        />
        <Route path="/AdminDashboardUsers" element={<AdminDashboardUsers />} />
        <Route
          path="/EncargadoLocalEnvioCupon"
          element={<EncargadoLocalEnvioCupon />}
        />
        <Route
          path="/EncargadoLocalListaCupones"
          element={<EncargadoLocalListaCupones />}
        />
        <Route path="/EncargadoQRCupones" element={<EncargadoQRCupones />} />
        <Route
          path="/EncargadoQRListaCodigos"
          element={<EncargadoQRListaCodigos />}
        />
      </Routes>
    </>
  );
};

export default App;
