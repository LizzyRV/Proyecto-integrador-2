from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacientesViewSet, OdontologoViewSet, DisponibilidadViewSet, CitasViewSet

router = DefaultRouter()
router.register(r'pacientes', PacientesViewSet)
router.register(r'odontologos', OdontologoViewSet)  
router.register(r'disponibilidades', DisponibilidadViewSet)
router.register(r'citas', CitasViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]
