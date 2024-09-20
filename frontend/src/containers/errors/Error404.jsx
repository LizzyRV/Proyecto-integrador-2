import Layout from '../../hocs/Layout';
import React from 'react';
import { Link } from 'react-router-dom';


const Error404 = () => {
    return (
        <Layout>
        <div className="error404-container">
            <h1>404</h1>
            <h2>¡Página No Encontrada!</h2>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <Link to="/">Volver a la Página Principal</Link>
        </div>
        </Layout>
    );
};

export default Error404;
