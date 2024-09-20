from django.contrib import admin
from .models import Pacientes, Odontologo, Disponibilidad, Citas

admin.site.register(Pacientes)
admin.site.register(Odontologo)
admin.site.register(Disponibilidad)
admin.site.register(Citas)
