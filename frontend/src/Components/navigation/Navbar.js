import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/index.css'


function Navbarr() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true');

    // Usamos useEffect para actualizar el estado cuando cambian los valores en localStorage
    useEffect(() => {
        const checkAuthStatus = () => {
            setToken(localStorage.getItem('access_token'));
            setIsAdmin(localStorage.getItem('is_admin') === 'true');
        };
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const cerrarSesion = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            await axios.post('http://127.0.0.1:8000/auth/logout/', { refresh_token: refreshToken });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            // Eliminar tokens del localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('is_admin');
            setToken(null); // Actualizar estado
            setIsAdmin(false); // Actualizar estado
    
            // Redirigir a la página de inicio
            navigate('/');
        }
    };
    return (
        <Navbar expand="lg">
            <div className="navbar-container">
                <img src="logo.png" alt="Logo" className="navbar-logo" />
                <Nav as={Link} to="/" className='custom-navbar-text'>Odonto Clinic</Nav>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav className="me-auto">

                   
                        {!token ? (
                            // Mostrar si no está autenticado
                            <div className="right-content">
                            <Button variant="outline-danger" id='navbar-text' className="ms-auto navbar-button">
                            <Nav.Link as={Link} to="/login" >Iniciar sesión</Nav.Link></Button>
                            </div>
                        ) : (
                    
                            <>
                                {/* Funcionalidades de usuarios regulares */}
                                {!isAdmin && (
                                    <NavDropdown title="Gestiona tus citas" id="user-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/programar_cita" className='navbar-text2'>Programar Cita</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                
                                {/* Opción para editar perfil (visible para todos los usuarios autenticados) */}
                                <Nav.Link as={Link} to="/editar-perfil" className='navbar-text3'>Editar Perfil</Nav.Link>

                                {/* Funcionalidades exclusivas de administradores */}
                                {isAdmin && (
                                    <NavDropdown title="Funciones de administrador" id="admin-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/admin-dashboard" className='navbar-text2'>Panel de Administración</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin-gestion-odontologos" className='navbar-text2'>Gestionar Odontólogos</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin-gestion-disponibilidades" className='navbar-text2'>Gestionar Disponibilidades</NavDropdown.Item>
                                        
                                    </NavDropdown>
                                )}

                                {/* Botón para cerrar sesión */}
                                <Button variant="outline-danger" onClick={cerrarSesion} className='navbar-text2'>Cerrar sesión</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Navbarr;
