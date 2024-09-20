import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RegistroForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefonoContacto, setTelefonoContacto] = useState('');
    const [nombreEmergencia, setNombreEmergencia] = useState('');
    const [telefonoEmergencia, setTelefonoEmergencia] = useState('');
    const [parentescoEmergencia, setParentescoEmergencia] = useState('');
    const [error, setError] = useState('');  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const data = {
                username,
                password,
                cedula,
                nombre,
                apellidos,
                direccion,
                telefono_contacto: telefonoContacto,
                nombre_apellido_contacto_emergencia: nombreEmergencia,
                telefono_emergencia: telefonoEmergencia,
                parentesco_contacto_emergencia: parentescoEmergencia
            };
            console.log("Datos a enviar:", data); 

            const response = await axios.post('http://127.0.0.1:8000/auth/register/', data)



            if (response.status === 201) {
                alert("Registro exitoso. Por favor inicia sesión.");
                navigate('/login');
            }
        } catch (error) {
            console.error("Error durante el registro:", error);
            if (error.response && error.response.data) {
          
                setError(error.response.data.detail || 'Error en el registro. Verifica los datos ingresados.');
            } else {
                alert("Error durante el registro. Por favor intenta de nuevo.");
            }
        }
    };

    return (

        <Form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>} 

      
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese su nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
            </Form.Group>

            
            <Form.Group controlId="formBasicCedula">
                <Form.Label>Cédula</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese su cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required
                />
            </Form.Group>

       
            <Form.Group controlId="formBasicNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese su nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </Form.Group>

       
            <Form.Group controlId="formBasicApellidos">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese sus apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                />
            </Form.Group>

        
            <Form.Group controlId="formBasicDireccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese su dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                />
            </Form.Group>

          
            <Form.Group controlId="formBasicTelefonoContacto">
                <Form.Label>Teléfono de Contacto</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese su teléfono de contacto"
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                    required
                />
            </Form.Group>

    
            <Form.Group controlId="formBasicNombreEmergencia">
                <Form.Label>Nombre de Contacto de Emergencia</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese el nombre del contacto de emergencia"
                    value={nombreEmergencia}
                    onChange={(e) => setNombreEmergencia(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicTelefonoEmergencia">
                <Form.Label>Teléfono de Contacto de Emergencia</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese el teléfono del contacto de emergencia"
                    value={telefonoEmergencia}
                    onChange={(e) => setTelefonoEmergencia(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicParentescoEmergencia">
                <Form.Label>Parentesco con Contacto de Emergencia</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Ingrese el parentesco del contacto de emergencia"
                    value={parentescoEmergencia}
                    onChange={(e) => setParentescoEmergencia(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Registrarse
            </Button>
        </Form>

    );
};

export default RegistroForm;
