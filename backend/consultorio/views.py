from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Pacientes, Odontologo, Disponibilidad, Citas
from .serializers import (
    PacientesSerializer,
    OdontologoSerializer,
    DisponibilidadSerializer,
    DisponibilidadesDifSerializer,
    CitasSerializer
)

# Vista para gestionar pacientes
class PacientesViewSet(viewsets.ModelViewSet):
    queryset = Pacientes.objects.all()
    serializer_class = PacientesSerializer

# Vista para gestionar odontólogos
class OdontologoViewSet(viewsets.ModelViewSet):
    queryset = Odontologo.objects.all()
    serializer_class = OdontologoSerializer
    permission_classes = [IsAuthenticated]

# Vista para gestionar disponibilidades
class DisponibilidadViewSet(viewsets.ModelViewSet):
    queryset = Disponibilidad.objects.all()
    serializer_class = DisponibilidadSerializer  # Esto asegura que las disponibilidades se serialicen correctamente.
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Disponibilidad.objects.filter(is_reserved=False)
        odontologo_id = self.request.query_params.get('odontologo_id')
        if odontologo_id:
            queryset = queryset.filter(odontologo_id=odontologo_id)
        return queryset

    def create(self, request):
        print("Datos recibidos:", request.data)
        serializer = DisponibilidadesDifSerializer(data=request.data)
        
        # Verifica si el serializador es válido
        if serializer.is_valid():
            try:
                serializer.save()  # Guardar la nueva disponibilidad
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Agrega manejo de excepciones inesperadas
                print(f"Error al crear disponibilidad: {e}")
                return Response({"detail": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Si los datos no son válidos, devuelve los errores
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CitasViewSet(viewsets.ModelViewSet):
    queryset = Citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = [IsAuthenticated]

    # Manejo de creación de citas
def perform_create(self, serializer):
    try:
        cedula_paciente = self.request.data.get('paciente')
        paciente = Pacientes.objects.get(cedula=cedula_paciente)

        # Guardar la cita
        cita = serializer.save(paciente=paciente)

        # Verificar si la disponibilidad está ocupada
        disponibilidad = cita.disponibilidad
        if disponibilidad.is_reserved:
            raise ValidationError({"disponibilidad": "Esta disponibilidad ya ha sido reservada."})

        # Marcar la disponibilidad como reservada
        disponibilidad.is_reserved = True
        disponibilidad.save()

    except Pacientes.DoesNotExist:
        raise ValidationError({"paciente": "El paciente con la cédula especificada no existe."})
    except Exception as e:
        raise ValidationError({"error": f"Ocurrió un error inesperado: {str(e)}"})


    # Manejo de cancelación de citas
    def destroy(self, request, *args, **kwargs):
        cita = self.get_object()
        disponibilidad = cita.disponibilidad

        # Marcar la disponibilidad como no reservada (liberarla)
        disponibilidad.is_reserved = False
        disponibilidad.save()

        # Cambiar el estado de la cita a 'cancelada'
        cita.estado = 'cancelada'
        cita.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    # Obtener las citas con filtros
    def get_queryset(self):
        queryset = Citas.objects.all()  # Obtener todas las citas
        queryset = queryset.exclude(estado='cancelada')

        # Filtros opcionales
        odontologo_id = self.request.query_params.get('odontologo_id')  # Filtrar por odontólogo
        fecha = self.request.query_params.get('fecha')  # Filtrar por fecha
        hora = self.request.query_params.get('hora')  # Filtrar por hora

        # Filtrar por odontólogo si se proporciona el ID
        if odontologo_id:
            queryset = queryset.filter(odontologo_id=odontologo_id)
            print(f"Citas filtradas por odontólogo {odontologo_id}: {queryset.count()} resultados")

        # Filtrar por disponibilidad (fecha) si se proporciona
        if fecha:
            queryset = queryset.filter(disponibilidad__fecha=fecha)
            print(f"Citas filtradas por fecha {fecha}: {queryset.count()} resultados")

        # Filtrar por disponibilidad (hora) si se proporciona
        if hora:
            queryset = queryset.filter(disponibilidad__hora=hora)
            print(f"Citas filtradas por hora {hora}: {queryset.count()} resultados")

        # Depuración: número total de citas encontradas
        print(f"Total de citas encontradas: {queryset.count()}")

        return queryset