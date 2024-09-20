import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('access_token');  
    const isAdmin = localStorage.getItem('is_admin') === 'true';  

    if (!token) {
        
        return <Navigate to="/login" replace />;
    }

  
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));  
        const expirationTime = tokenPayload.exp * 1000;  
        if (Date.now() > expirationTime) {
            
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('is_admin');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
    
        console.error("Token inválido:", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('is_admin');
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        
        return <Navigate to="/login" replace />;
    }

    // Si todo está bien, permitir el acceso a la ruta
    return children;
};

export default PrivateRoute;
