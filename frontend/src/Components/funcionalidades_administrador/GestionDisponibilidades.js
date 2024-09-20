import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../hocs/Layout';

const GestionDisponibilidades = () => {
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [odontologos, setOdontologos] = useState([]);
    const [selectedOdontologo, setSelectedOdontologo] = useState('');
    const [selectedFecha, setSelectedFecha] = useState('');
    const [horas, setHoras] = useState(['']);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFechas, setSelectedFechas] = useState([]);
    const [selectedHoras, setSelectedHoras] = useState([]); 

 
    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
                refresh: refreshToken,
            });

            localStorage.setItem('access_token', response.data.access);

            return response.data.access;
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            return null;
        }
    };

    const makeRequestWithToken = async (url, method = 'GET', data = null) => {
        let token = localStorage.getItem('access_token');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method,
                url,
                data,
            };
            const response = await axios(config);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                        method,
                        url,
                        data,
                    };
                    const response = await axios(config);
                    return response;
                } else {
                    throw new Error('No se pudo refrescar el token.');
                }
            } else {
                throw error;
            }
        }
    };

    const fetchDisponibilidades = async () => {
        try {
            const response = await makeRequestWithToken('http://127.0.0.1:8000/api/disponibilidades/');
            console.log('Datos de disponibilidades:', response.data);  // Verifica los datos que llegan
            setDisponibilidades(response.data);
        } catch (error) {
            setError('Error al cargar disponibilidades.');
        }
    }

    const fetchOdontologos = async () => {
        try {
            const response = await makeRequestWithToken('http://127.0.0.1:8000/api/odontologos/');
            setOdontologos(response.data);
        } catch (error) {
            setError('Error al cargar odontólogos.');
        }
    };

    useEffect(() => {
        fetchDisponibilidades();
        fetchOdontologos();
    }, []);

    const handleAddDisponibilidad = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
    
        if (!token) {
            setError('No se encontró el token de acceso. Inicia sesión nuevamente.');
            return;
        }
    
    
        const horasFiltradas = selectedHoras.filter(hora => hora.trim() !== '');
        if (horasFiltradas.length === 0 || !selectedFecha || !selectedOdontologo) {
            setError('Debes seleccionar un odontólogo, una fecha y al menos una hora.');
            return;
        }
    
        const data = {
            odontologo: parseInt(selectedOdontologo),
            fechas: [selectedFecha],
            horas: horasFiltradas
        };
    
        console.log("Datos a enviar:", data);
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/disponibilidades/', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("Respuesta del servidor:", response.data);
    
        
            if (Array.isArray(response.data)) {
                setDisponibilidades([...disponibilidades, ...response.data]);
            } else {
                setDisponibilidades([...disponibilidades, response.data]);
            }
    
            setSuccessMessage('Disponibilidades agregadas con éxito.');
            setSelectedOdontologo('');
            setSelectedFecha('');
            setSelectedHoras(['']);
    

            await fetchDisponibilidades();
    
        } catch (error) {
            console.error('Error al agregar disponibilidad:', error);
    
            if (error.response) {
                if (error.response.status === 401) {
                    setError('No autorizado. Tu sesión ha expirado. Inicia sesión nuevamente.');
                } else {
                    setError(`Error al agregar disponibilidad: ${error.response.data.detail || 'Verifique los datos ingresados'}`);
                }
            } else if (error.request) {
                setError('No se recibió respuesta del servidor. Verifica tu conexión.');
            } else {
                setError('Error al procesar la solicitud. Inténtalo de nuevo más tarde.');
            }
        }
    };
    
    const handleDeleteDisponibilidad = async (id) => {
        try {
            await makeRequestWithToken(`http://127.0.0.1:8000/api/disponibilidades/${id}/`, 'DELETE');
            setDisponibilidades(disponibilidades.filter((disp) => disp.id !== id));
            setSuccessMessage('Disponibilidad eliminada con éxito.');
        } catch (error) {
            setError('Error al eliminar la disponibilidad.');
        }
    };

    const handleHorasChange = (index, value) => {
        const newHoras = [...horas];
        newHoras[index] = value;
        setHoras(newHoras);  
        setSelectedHoras(newHoras);  
    };

    const handleAddHora = () => {
        setHoras([...horas, '']);
    };

    const handleRemoveHora = (index) => {
        const newHoras = horas.filter((_, i) => i !== index);
        setHoras(newHoras);
    };

    return (
        <Layout>
            <div className="container mt-5">
                <h2>Gestión de Disponibilidades</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                <form onSubmit={handleAddDisponibilidad}>
                    <div className="form-group">
                        <label>Odontólogo:</label>
                        <select
                            value={selectedOdontologo}
                            onChange={(e) => setSelectedOdontologo(e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">Seleccionar odontólogo</option>
                            {odontologos.map((odontologo) => (
                                <option key={odontologo.id} value={odontologo.id}>
                                    {odontologo.nombre_completo || "Odontólogo no disponible"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mt-3">
                        <label>Fecha:</label>
                        <input
                            type="date"
                            value={selectedFecha}
                            onChange={(e) => setSelectedFecha(e.target.value)}  // Usar un solo valor de fecha
                            className="form-control"
                            required
                        />
                    </div>

                    {horas.map((hora, index) => (
                        <div key={index} className="mt-3">
                            <div className="form-group">
                                <label>Hora:</label>
                                <input
                                    type="time"
                                    value={hora}
                                    onChange={(e) => handleHorasChange(index, e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger mt-2"
                                onClick={() => handleRemoveHora(index)}
                            >
                                Eliminar Hora
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary mt-3"
                        onClick={handleAddHora}
                    >
                        Agregar Hora
                    </button>

                    <button type="submit" className="btn btn-primary mt-3">Agregar Disponibilidades</button>
                </form>

                <h3 className="mt-5">Lista de Disponibilidades</h3>
                <ul>
                    {disponibilidades.map((disp, index) => (
                        <li key={disp.id || index}>  
                        {disp.odontologo ? disp.odontologo.nombre_completo : "Odontólogo no disponible"} - {disp.fecha} {disp.hora}
                        <button
                            onClick={() => handleDeleteDisponibilidad(disp.id)}
                            className="btn btn-danger ms-3"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default GestionDisponibilidades;
