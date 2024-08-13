# properties/urls.py

from django.urls import path

from .views import CityListCreateView, ZoneListCreateView, PropertyListCreateView, ReservationListCreateView, \
    ReservationDetailView, UserProfileView

urlpatterns = [
    path('cities/', CityListCreateView.as_view(), name='city-list-create'),
    path('zones/', ZoneListCreateView.as_view(), name='zone-list-create'),
    path('properties/', PropertyListCreateView.as_view(), name='property-list-create'),
    path('reservations/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
    # user propile view
    path('profile/', UserProfileView.as_view(), name='profile'),
]
