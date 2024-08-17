
from django.urls import path
from .views import *
app_name = 'sdaSite'

urlpatterns = [
    path('', home, name='home'),
    path('inscription/', inscription, name='inscription'),
    path('connexion/', connexion, name='connexion'),
    path('logout/', deconnexion, name='logout'),
    path('profile/', profile, name='profile'),

    # Reservation
    path('reservation/', reservation, name='reservation'),
    path('reserved/<int:id>/', reserved, name='reserved'),

    # properties
    path('properties/', properties, name='properties'),
    path('property/<int:id>/details/', details_property, name='show_property'),
    path('property/new/', new_property, name='new_property'),
    path('property/<int:id>/edit/', edit_property, name='edit_property'),
    path('property/<int:id>/delete/', delete_property, name='delete_property'),
]
