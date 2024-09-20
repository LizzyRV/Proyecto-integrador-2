from django.db import models
from django.conf import settings


class Pacientes(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Relación con User
    cedula = models.CharField(max_length=15, unique=True)
    nombre = models.CharField(max_length=70)
    apellidos = models.CharField(max_length=70)
    direccion = models.CharField(max_length=200) #Permite letras y números
    telefono_contacto = models.CharField(max_length=15)
    nombre_apellido_contacto_emergencia = models.CharField(max_length=150)
    telefono_emergencia = models.CharField(max_length=15)
    parentesco_contacto_emergencia = models.CharField(max_length=20)
    def __str__(self):
        return f"CC {self.cedula} - {self.nombre} {self.apellidos} "
    
class Odontologo(models.Model):
    nombre_completo = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_completo


class Disponibilidad(models.Model):
    odontologo = models.ForeignKey(Odontologo, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    is_reserved = models.BooleanField(default=False)  

    def __str__(self):
        return f"Se programó la disponibilidad para {self.odontologo.nombre_completo} con los siguientes horarios: {self.fecha} {self.hora}" #Llamo el nombre del odontologo de la clase anterior

class Citas(models.Model):
    paciente = models.ForeignKey(Pacientes, on_delete=models.CASCADE) #Igual, si elimino un paciente elimino las diferentes citas que pueda tener
    odontologo = models.ForeignKey(Odontologo, on_delete=models.CASCADE) # Un paciente por diferentes tratamientos puede consultar diferentes odontologos
    disponibilidad = models.OneToOneField(Disponibilidad, on_delete=models.CASCADE) #Cuando el paciente seleccione su cita éste espacio ya no queda disponible. Solo un paciente puede tener una disponibilidad
    causa_consulta = models.TextField()
    estado = models.CharField(max_length=10, default='activa') 

    def __str__(self):
        return (f"Se ha agendado la cita para el paciente {self.paciente.nombre} {self.paciente.apellidos}" 
        f"con el profesional {self.odontologo.nombre_completo} el día {self.disponibilidad.fecha} a las "
        f"{self.disponibilidad.hora}. Recuerde que si no puede asistir a su cita debe cancelarla por lo menos" 
        "con 4 horas de anticipación")