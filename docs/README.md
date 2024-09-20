---
noteId: "2eb9c7c076ff11ef8c98ef3c24afc504"
tags: []

---

Odonto Clinic, es un sistema de gestión de citas odontológicas.

En este sitio web los usuarios del consultorio podrán gestionar todo aquello referente a la programación, cancelación y gestión de sus citas. Para esto deberán estar registrados en el sitio web 
y dar información personal requerida para culminar con éxito su registro. 
Después del registro deberán iniciar seccion donde encontrarán un panel para usuarios autenticados y  podrán gestionar sus citas y editar su perfil. También se cuenta con un perfil administrador general mediante el cual se podrán crear los odontólogos y sus disponibilidades.

Es decir que este proyecto cuenta con autenticación de usuarios y manejo de roles después de ella. 
Para ingresar al panel de administrador es con el usuario admin y contraseña 123456

Este proyecto se implementó mediante:

Backend: Django, Django REST Framework, JWT para autenticación.
Frontend: React, Axios, React Bootstrap para el diseño.
Base de Datos: PostgreSQL
Herramientas: Postman para pruebas de la API

Para el registro e inicio de sesion de los usuarios se utilizó JWT. 

Instrucciones para ejecutar el proyecto:

1. Descargar el repositorio. 
2. Activar el entorno virtual en la terminal: source ./entorno/Scripts/activate
3. cd backend/ 
4. Instalar las siguientes dependencias

pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers

python manage.py migrate
python manage.py runserver

Para acceder al frontend, en una nueva terminal: 
1. Activar el entorno virtual: source ./entorno/Scripts/activate
2. cd frontend/
3. npm install
4. npm start

