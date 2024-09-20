import React, { useState } from 'react';


const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Por favor, complete todos los campos.');
            return;
        }

        setErrorMessage('');

        handleLogin(username, password)
            .catch((error) => {
                setErrorMessage('Usuario o contraseña incorrectos.'); 
            });
    };

    return (

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    className="form-control" 
                />
            </div>
            <div className="form-group mt-3">
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="form-control" 
                />
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  
            <button type="submit" className="btn btn-primary mt-3">Iniciar Sesión</button>
        </form>

    );
};

export default LoginForm;
