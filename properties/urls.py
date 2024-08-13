# properties/urls.py

from django.urls import path

from .views import CityListCreateView, ZoneListCreateView, PropertyListCreateView, ReservationListCreateView, \
    ReservationDetailView, UserProfileView, PropertyDetailView, CityDetailView, ZoneDetailView

urlpatterns = [
    path('cities/', CityListCreateView.as_view(), name='city-list-create'),
    path('cities/<int:pk>/', CityDetailView.as_view(), name='city-detail'),
    path('zones/', ZoneListCreateView.as_view(), name='zone-list-create'),
    path('zones/<int:pk>/', ZoneDetailView.as_view(), name='zone-detail'),
    path('properties/', PropertyListCreateView.as_view(), name='property-list-create'),
    path('properties/<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    
    path('reservations/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
    # user propile view
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
]
