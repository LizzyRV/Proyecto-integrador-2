import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../hocs/Layout'

const ProgramarCita = () => {
    const [odontologos, setOdontologos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [selectedOdontologo, setSelectedOdontologo] = useState('');
    const [selectedDisponibilidad, setSelectedDisponibilidad] = useState('');
    const [causaConsulta, setCausaConsulta] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOdontologos();
        fetchCitas();
    }, []);

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
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
       
            return null;
        }
    };
    

    const makeRequestWithToken = async (url, method = 'GET', data = null) => {
        let token = localStorage.getItem('access_token');
        if (!token) {
            setError('No estás autenticado. Por favor, inicia sesión nuevamente.');
            return;
        }
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
                }
            }
            throw error;
        }
    };

    const fetchOdontologos = async () => {
        try {
            setLoading(true);
            const response = await makeRequestWithToken('http://127.0.0.1:8000/api/odontologos/');
            setOdontologos(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Error al cargar odontólogos.');
        }
    };

    const fetchDisponibilidades = async (odontologoId) => {
        try {
            setLoading(true);
            const response = await makeRequestWithToken(`http://127.0.0.1:8000/api/disponibilidades/?odontologo_id=${odontologoId}`);
            setDisponibilidades(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Error al cargar disponibilidades.');
        }
    };

    const fetchCitas = async () => {
        try {
            setLoading(true);
            const response = await makeRequestWithToken('http://127.0.0.1:8000/api/citas/');
            console.log("Citas obtenidas:", response.data);
            setCitas(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Error al cargar citas.');
        }
    };

    const handleOdontologoChange = (e) => {
        const odontologoId = e.target.value;
        setSelectedOdontologo(odontologoId);
        setSelectedDisponibilidad('');
        fetchDisponibilidades(odontologoId);
    };

    const getPacienteCedula = async () => {
        try {
            const response = await makeRequestWithToken('http://127.0.0.1:8000/auth/current-user/');
            return response.data.cedula;
        } catch (error) {
            throw new Error("No se pudo obtener la cédula del paciente.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const pacienteCedula = await getPacienteCedula();
            console.log("ID de disponibilidad seleccionada:", selectedDisponibilidad);
            const dataToSend = {
                paciente: pacienteCedula,
                odontologo: parseInt(selectedOdontologo),
                disponibilidad: parseInt(selectedDisponibilidad),
                causa_consulta: causaConsulta
            };
    
            const response = await makeRequestWithToken(
                'http://127.0.0.1:8000/api/citas/',
                'POST',
                dataToSend
            );
    
            if (response.status === 201) {
                setSuccessMessage('Cita programada con éxito.');
                setSelectedDisponibilidad('');
                setSelectedOdontologo('');
                setCausaConsulta('');
                fetchCitas();
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
               
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
           
            } else {
                setError('Error al programar la cita.');
            }
        }
    };

    const cancelarCita = async (citaId) => {
        console.log("ID de cita a cancelar:", citaId);
        try {
            setLoading(true);
            await makeRequestWithToken(`http://127.0.0.1:8000/api/citas/${citaId}/`, 'DELETE');
            await fetchCitas();  
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Error al cancelar la cita.');
        }
    };

    return (
        <Layout>
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {loading && <p>Cargando...</p>}
                <div>
                    <label>Odontólogo:</label>
                    <select value={selectedOdontologo} onChange={handleOdontologoChange} required>
                        <option value="">Selecciona un odontólogo</option>
                        {odontologos.map((odontologo) => (
                            <option key={odontologo.id} value={odontologo.id}>
                                {odontologo.nombre_completo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Disponibilidad:</label>
                    <select value={selectedDisponibilidad} onChange={(e) => setSelectedDisponibilidad(e.target.value)} required>
                        <option value="">Selecciona una disponibilidad</option>
                        {disponibilidades.map((disp) => (
                            <option key={disp.id} value={disp.id}>
                                {disp.fecha} {disp.hora}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Causa de la consulta:</label>
                    <textarea
                        value={causaConsulta}
                        onChange={(e) => setCausaConsulta(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit" disabled={loading}>Programar Cita</button>
            </form>

            <h2>Mis Citas Programadas</h2>
            {citas.length === 0 && <p>No tienes citas programadas.</p>}
            <ul>
                {citas.map(cita => (
                    <li key={cita.id}>
                        <p>El paciente {cita.paciente} tiene programadas las siguientes citas:</p>
                        <p>Odontólogo: {cita.odontologo}</p>
                        <p>Disponibilidad: {cita.fecha} {cita.hora}</p>
                        <p>Causa: {cita.causa_consulta}</p>
                        <button onClick={() => cancelarCita(cita.id)}>Cancelar Cita</button>
                    </li>
                ))}
            </ul>
        </div>
        </Layout>
    );
};

export default ProgramarCita;
