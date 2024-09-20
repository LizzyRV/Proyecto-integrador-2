import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../hocs/Layout';

const AdminDashboard = () => {
    return (
        <Layout>
            <div className="container mt-5">
                <h1>Panel de Administración</h1>
                <p>Gestiona los recursos del sistema odontológico.</p>

                <div className="mt-4">
                
                    <h3>Gestionar Odontólogos</h3>
                    <Link to="/admin-gestion-odontologos" className="btn btn-primary mt-2">
                        Ir a Gestión de Odontólogos
                    </Link>

                    <h3 className="mt-5">Gestionar Disponibilidades</h3>
                    <Link to="/admin-gestion-disponibilidades" className="btn btn-primary mt-2">
                        Ir a Gestión de Disponibilidades
                    </Link>

                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
