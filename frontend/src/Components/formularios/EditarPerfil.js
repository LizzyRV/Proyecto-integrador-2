import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../hocs/Layout';


const EditarPerfil = () => {
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState(''); 
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [cedula, setCedula] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

 
    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
                refresh: refreshToken,
            });
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            throw new Error("No se pudo refrescar el token.");
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                let token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/auth/current-user/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const { direccion, telefono_contacto, nombre, apellidos, cedula } = response.data;

                setDireccion(direccion);
                setTelefono(telefono_contacto);
                setNombre(nombre);
                setApellidos(apellidos);
                setCedula(cedula);
            } catch (error) {
                if (error.response && error.response.status === 401) {
         
                    try {
                        const newToken = await refreshToken();
                        const response = await axios.get('http://127.0.0.1:8000/auth/current-user/', {
                            headers: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        const { direccion, telefono_contacto, nombre, apellidos, cedula } = response.data;

                        setDireccion(direccion);
                        setTelefono(telefono_contacto);
                        setNombre(nombre);
                        setApellidos(apellidos);
                        setCedula(cedula);
                    } catch (refreshError) {
                        setError("Error al refrescar el token.");
                    }
                } else {
                    setError("Error al cargar los detalles del perfil.");
                }
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token'); // Esto me permite obtener el token de localStorage
            const response = await axios.put('http://127.0.0.1:8000/auth/edit-profile/', {
                direccion,
                telefono
            }, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
    
            if (response.status === 200) {
                setSuccessMessage("Perfil actualizado con éxito.");
            }
        } catch (error) {
            setError("Error al actualizar el perfil.");
            console.error(error.response.data); // Para ver más detalles del error
        }
    };
    
    return (
        <Layout>
        <div className="profile-container">
            <h2>Detalles del Perfil</h2>
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Apellidos:</strong> {apellidos}</p>
            <p><strong>Cédula:</strong> {cedula}</p>
            <p><strong>Teléfono:</strong> {telefono}</p>
            <p><strong>Dirección:</strong> {direccion}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Teléfono:</label>
                    <input 
                        type="text" 
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Dirección:</label>
                    <input 
                        type="text" 
                        value={direccion} 
                        onChange={(e) => setDireccion(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="error-message">{successMessage}</p>}
                <button type="submit">Actualizar Perfil</button>
            </form>
        </div>
        </Layout>
    );
};

export default EditarPerfil;
