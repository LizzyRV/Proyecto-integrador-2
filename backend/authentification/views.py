from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User
from .serializers import UserSerializer, EditProfileSerializer
from .permissions import IsAdmin
from consultorio.models import Pacientes




authentication_classes = [JWTAuthentication] #Implemento el JWT

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request):
        is_admin = request.data.get('is_admin', False)

        if is_admin and (not request.user.is_authenticated or not request.user.is_admin):
            return Response({'error': 'Solo los administradores pueden crear otros administradores.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save(is_admin=is_admin)

        if 'cedula' in request.data:
            try:
                Pacientes.objects.create(
                    user=user,
                    cedula=request.data['cedula'],
                    nombre=request.data['nombre'],
                    apellidos=request.data['apellidos'],
                    direccion=request.data['direccion'],
                    telefono_contacto=request.data['telefono_contacto'],
                    nombre_apellido_contacto_emergencia=request.data['nombre_apellido_contacto_emergencia'],
                    telefono_emergencia=request.data['telefono_emergencia'],
                    parentesco_contacto_emergencia=request.data['parentesco_contacto_emergencia']
                )
            except KeyError as e:
                return Response({"error": f"Falta el campo obligatorio: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.id,
            'username': user.username,
            'nombre': user.nombre,
            'apellidos': user.apellidos,
            'direccion': user.direccion,
            'cedula': user.cedula,
            'telefono_contacto': user.telefono_contacto,
            'is_admin': user.is_admin
        }
        return Response(user_data)

class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = EditProfileSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = EditProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
