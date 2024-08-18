# properties/views.py
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import City, Zone, Property, Reservation
from .serializers import CitySerializer, ZoneSerializer, PropertySerializer, ReservationSerializer
from .permissions import IsManager

from rest_framework.response import Response


class CityListCreateView(generics.ListCreateAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification


class CityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification

class ZoneListCreateView(generics.ListCreateAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification

class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification

class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]  # Exige une authentification
    
# Uppade and delete
class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification
    
class ReservationListCreateView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification


    
    
class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]  # Exige une authentification


from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.urls import reverse

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_authenticated:
            # Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
            login_url = reverse('connexion')  # Assurez-vous d'avoir la vue 'login' configurée
            next_url = request.build_absolute_uri()  # URL actuelle
            return HttpResponseRedirect(f'{login_url}?next={next_url}')
        
        user = request.user
        role = 'superuser' if user.is_superuser else 'staff' if user.is_staff else 'user'
        group = user.groups.first()
        return Response({
            "username": user.username,
            "email": user.email,
            "role": role,
            "group": group.name if group else None,
            'token': str(user.auth_token),
        })
    


