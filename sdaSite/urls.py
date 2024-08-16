
from django.urls import path
from .views import *


urlpatterns = [
    path('', home, name='home'),
    path('inscription/', inscription, name='inscription'),
    path('profile/', profile, name='profile'),
    path('reservation/', reservation, name='reservation'),
    path('reserved/<int:id>/', reserved, name='reserved'),
]
