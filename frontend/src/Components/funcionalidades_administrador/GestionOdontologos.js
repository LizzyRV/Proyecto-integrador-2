import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../hocs/Layout';

const GestionOdontologos = () => {
    const [odontologos, setOdontologos] = useState([]);
    const [nombreOdontologo, setNombreOdontologo] = useState('');
    const [error, setError] = useState('');  // Para ver los erroress
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
            console.error("Error al refrescar el token:", error);
            return null;
        }
    };


    const fetchOdontologos = async () => {
        let token = localStorage.getItem('access_token');
        console.log('Token:', token); 

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/odontologos/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOdontologos(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
               
                const newToken = await refreshToken();
                if (newToken) {
                    try {
                        const response = await axios.get('http://127.0.0.1:8000/api/odontologos/', {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        });
                        setOdontologos(response.data);
                    } catch (err) {
                        console.error("Error al obtener odontólogos después de refrescar el token:", err);
                        setError('Error al cargar odontólogos.');  
                    }
                } else {
                    setError('No se pudo refrescar el token. Inicia sesión nuevamente.');
                }
            } else {
                console.error("Error al cargar odontólogos:", error);
                setError('Error al cargar odontólogos.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/odontologos/', {
                nombre_completo: nombreOdontologo,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
          
            setOdontologos([...odontologos, response.data]);
            setSuccessMessage('Odontólogo agregado con éxito.');
            setNombreOdontologo('');  
        } catch (error) {
            setError('Error al agregar odontólogo.');
        }
    };

    useEffect(() => {
        fetchOdontologos();  
    }, []);

    return (
        <Layout>
            <div className="container mt-5">
                <h2>Gestión de Odontólogos</h2>

               
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

             
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre del Odontólogo:</label>
                        <input
                            type="text"
                            value={nombreOdontologo}
                            onChange={(e) => setNombreOdontologo(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Agregar Odontólogo</button>
                </form>

                {/* Mostrar la lista de odontólogos */}
                <h3 className="mt-5">Lista de Odontólogos</h3>
                <ul>
                    {odontologos.map((odontologo) => (
                        <li key={odontologo.id}>{odontologo.nombre_completo}</li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default GestionOdontologos;
