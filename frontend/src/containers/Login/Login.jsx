import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../Components/home/LoginForm';
import Layout from '../../hocs/Layout'

const Login = () => {
    const navigate = useNavigate();
    const API_URL = 'http://127.0.0.1:8000/token/';
    const API_URL_UI = 'http://127.0.0.1:8000/auth/current-user/';

   
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
           
            const isAdmin = localStorage.getItem('is_admin') === 'true';
            if (isAdmin) {
                navigate('/admin-dashboard'); 
            } else {
                navigate('/');  
            }
        }
    }, [navigate]);

 
    const handleLogin = async (username, password) => {
        try {
          
            const response = await axios.post(API_URL, { username, password });
            const token = response.data.access;
            const refreshToken = response.data.refresh;

         
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', refreshToken);

           
            const userResponse = await axios.get(API_URL_UI, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

           
            const isAdmin = userResponse.data.is_admin;
            localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');  
            if (isAdmin) {
                navigate('/admin-dashboard'); 
            } else {
                navigate('/');  
            }
        } catch (error) {
            throw new Error('Error en el login');  
        }
    };

    return (
        <Layout>
            <div className="container mt-5">
                <h2>Iniciar Sesión</h2>
               
                <LoginForm handleLogin={handleLogin} />

                <div className="mt-4">
                    <p>¿Aún no está registrado?</p>
                    <button onClick={() => navigate('/registro_usuario')} className="btn btn-secondary">
                        Registrarse
                    </button>
                </div>
            </div>
        </Layout>
    );  
};

export default Login;
