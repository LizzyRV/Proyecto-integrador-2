import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../hocs/Layout';


const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const isAdmin = localStorage.getItem('is_admin') === 'true';

        if (token) {
            setIsAuthenticated(true);

            if (isAdmin) {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('is_admin');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <Layout>
        
          <div className="container5">
          <h1 className="titulo-principal">Bienvenido a Odonto Clinic</h1>
            {isAuthenticated ? (
              <div className="contenedor">
                <div className="columna-izquierda">
                  <p className="text-pag">
                    En este espacio podrá programar y gestionar tus citas.
                    Si requiere ser atendido no dude en ponerse en contacto a través de las líneas de atención.
                  </p>
                </div>
                <div className="columna-derecha">
                    <p className="text-pag">hola</p>
                </div>
              </div>
            ) : (
              <div className="contenedor">
                <div className="columna-izquierda">
                  <p className="text-pag">
                    En este espacio podrá programar y gestionar tus citas.
                    Por favor, inicia sesión para gestionar tus citas o regístrate
                    como nuevo usuario para poder acceder a nuestros servicios.
                    Si requiere ser atendido no dude en ponerse en contacto a través de las líneas de atención.
                  </p>
                </div>
                <div className="columna-derecha">
                    <p className="text-pag">¡Recuerda que la constancia es lo más importante para tu salud dental!</p>
                </div>
              </div>
            )}
          </div>
      

          <div className="titulo-container">
            <h3 className="titulo">Nuestros Servicios</h3>
          </div>
      
  
          <div className="imagenes-container">
            <div className="imagen-item">
              <img src="/images/imagen1.png" alt="Servicio 1" />
              <h4>Endodoncia</h4>
            </div>
            <div className="imagen-item">
              <img src="/images/impagen2.png" alt="Servicio 2" />
              <h4>Periodoncia</h4>
            </div>
            <div className="imagen-item">
              <img src="/images/imagen3.png" alt="Servicio 3" />
              <h4>Limpieza</h4>
            </div>
            <div className="imagen-item">
              <img src="/images/imagen4.png" alt="Servicio 4" />
              <h4>Odontología estética</h4>
            </div>
          </div>
        </Layout>
      );
};

export default Home;
