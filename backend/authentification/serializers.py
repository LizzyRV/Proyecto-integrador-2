from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'nombre', 'apellidos', 'direccion', 'cedula', 
                  'telefono_contacto', 'nombre_apellido_contacto_emergencia', 
                  'telefono_emergencia', 'parentesco_contacto_emergencia', 'is_admin']  
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print("Datos validados:", validated_data)
        if User.objects.filter(cedula=validated_data['cedula']).exists():
            raise serializers.ValidationError("La cédula ya está en uso.")
        user = User(
            username=validated_data['username'],
            nombre=validated_data.get('nombre', ''),
            apellidos=validated_data.get('apellidos', ''),
            direccion=validated_data.get('direccion', ''),
            cedula=validated_data.get('cedula', ''),
            telefono_contacto=validated_data.get('telefono_contacto', ''),
            nombre_apellido_contacto_emergencia=validated_data.get('nombre_apellido_contacto_emergencia', ''),
            telefono_emergencia=validated_data.get('telefono_emergencia', ''),
            parentesco_contacto_emergencia=validated_data.get('parentesco_contacto_emergencia', ''),
            is_admin=validated_data.get('is_admin', False)
        )
        
        user.set_password(validated_data['password'])  
        user.save()
        
        return user
    
class EditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['direccion', 'telefono_contacto']  
