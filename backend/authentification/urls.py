from django.urls import path,include
from . import views

from .views import CurrentUserView
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EditProfileView, CurrentUserView, LogoutView

router = DefaultRouter()
router.register(r'users', UserViewSet)


urlpatterns= [
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('register-admin/', UserViewSet.as_view({'post': 'create'}), name='register-admin'),  # Solo para crear administradores
    path('', include(router.urls)),
    path('edit-profile/', EditProfileView.as_view(), name='edit-profile'),
    path('logout/', views.LogoutView.as_view(), name ='logout')
]

