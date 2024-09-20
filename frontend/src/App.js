import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import Error404 from "./containers/errors/Error404";
import Login from "./containers/Login/Login";
import Registro_De_Usuarios from "./containers/Registro_De_Usuarios/Registro_De_Usuarios";
import PrivateRoute from "./Components/PrivateRoute";

import AdminDashboard from "./containers/AdminDashboard";
import GestionOdontologos from "./Components/funcionalidades_administrador/GestionOdontologos";
import GestionDisponibilidades from "./Components/funcionalidades_administrador/GestionDisponibilidades";

import ProgramarCitas from './Components/funcionalidades_usuarios/ProgramarCitas';
import EditarPerfil from "./Components/formularios/EditarPerfil";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro_usuario" element={<Registro_De_Usuarios />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        <Route path="/admin-dashboard" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin-gestion-odontologos" element={<PrivateRoute adminOnly={true}><GestionOdontologos /></PrivateRoute>} />
        <Route path="/admin-gestion-disponibilidades" element={<PrivateRoute adminOnly={true}><GestionDisponibilidades /></PrivateRoute>} />

        <Route path="/programar_cita" element={<PrivateRoute><ProgramarCitas /></PrivateRoute>} />
      
      
      </Routes>
    </Router>
  );
}

export default App;
