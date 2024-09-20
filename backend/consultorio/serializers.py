from rest_framework import serializers
from .models import Pacientes, Odontologo, Disponibilidad, Citas

class PacientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pacientes
        fields = '__all__'

class OdontologoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Odontologo
        fields = '__all__'

class DisponibilidadSerializer(serializers.ModelSerializer):
    odontologo = OdontologoSerializer()  # Permite ver el odontólogo en las disponibilidades

    class Meta:
        model = Disponibilidad
        fields = ['id', 'odontologo', 'fecha', 'hora', 'is_reserved']

class DisponibilidadesDifSerializer(serializers.Serializer):
    fechas = serializers.ListField(child=serializers.DateField(), write_only=True)
    horas = serializers.ListField(child=serializers.TimeField(), write_only=True)
    odontologo = serializers.PrimaryKeyRelatedField(queryset=Odontologo.objects.all(), write_only=True)

    def validate(self, data):

        if len(data['fechas']) == 0 or len(data['horas']) == 0:
            raise serializers.ValidationError("Debe proporcionar al menos una fecha y una hora.")

        for fecha in data['fechas']:
            for hora in data['horas']:
                if Disponibilidad.objects.filter(odontologo=data['odontologo'], fecha=fecha, hora=hora).exists():
                    raise serializers.ValidationError(f"Ya existe una disponibilidad para el {fecha} a las {hora} con este odontólogo.")
        return data

    def create(self, validated_data):
        fechas = validated_data.pop('fechas')
        horas = validated_data.pop('horas')
        odontologo = validated_data.pop('odontologo')

        disponibilidades = []
        for fecha in fechas:
            for hora in horas:
                disponibilidades.append(Disponibilidad(
                    odontologo=odontologo,
                    fecha=fecha,
                    hora=hora
                ))
        Disponibilidad.objects.bulk_create(disponibilidades)
        return disponibilidades

class CitasSerializer(serializers.ModelSerializer):
    paciente = serializers.SlugRelatedField(slug_field='cedula', queryset=Pacientes.objects.all())
    odontologo = serializers.PrimaryKeyRelatedField(queryset=Odontologo.objects.all())
    disponibilidad = serializers.PrimaryKeyRelatedField(queryset=Disponibilidad.objects.all())

    class Meta:
        model = Citas
        fields = ['id', 'paciente', 'odontologo', 'disponibilidad', 'causa_consulta', 'estado']

    def validate_disponibilidad(self, value):
        if value.is_reserved:
            raise serializers.ValidationError("Esta disponibilidad ya ha sido reservada.")
        return value
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['odontologo'] = instance.odontologo.nombre_completo  # Nombre del odontólogo
        representation['fecha'] = instance.disponibilidad.fecha  # Fecha de disponibilidad
        representation['hora'] = instance.disponibilidad.hora  # Hora de disponibilidad
        paciente = instance.paciente
        representation['paciente'] = f"{paciente.nombre} {paciente.apellidos} (CC: {paciente.cedula})"

        return representation