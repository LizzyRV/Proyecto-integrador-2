from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    cedula = models.CharField(max_length=15, unique=True)
    nombre = models.CharField(max_length=70, blank=True)
    apellidos = models.CharField(max_length=70, blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    telefono_contacto = models.CharField(max_length=15, blank=True)
    nombre_apellido_contacto_emergencia = models.CharField(max_length=150, blank=True)
    telefono_emergencia = models.CharField(max_length=15, blank=True)
    parentesco_contacto_emergencia = models.CharField(max_length=20, blank=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username