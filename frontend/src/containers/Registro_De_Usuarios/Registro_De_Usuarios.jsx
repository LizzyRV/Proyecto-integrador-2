import React from 'react';
import RegistroForm from '../../Components/formularios/RegistroForm';
import { Container } from 'react-bootstrap';
import Layout from '../../hocs/Layout';

function Registro_De_Usuarios() {
  return (
    <Layout>
      <Container className="mt-5">
        <h1>Register</h1>
        <RegistroForm />
      </Container>
    </Layout>
  );
}

export default Registro_De_Usuarios;
