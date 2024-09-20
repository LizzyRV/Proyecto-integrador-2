from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Permiso personalizado que solo permite el acceso a administradores.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin) #Para usuarios autenticados
