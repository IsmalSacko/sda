"""
URL configuration for sad project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as drf_views
from rest_framework.authtoken.views import obtain_auth_token
app_name = 'sad'

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('api/', include('properties.urls'), name='api'),
    path('accounts/', include('accounts.urls'), name='accounts'),
    path('registration/', include('dj_rest_auth.registration.urls'),    name='registration'),
    path('api-auth/', include('rest_framework.urls'), name='rest_framework',),  # Endpoint pour l'interface d'administration de DRF
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # Nouveau endpoint pour obtenir un token
    

    #home url
    path('', include('sdaSite.urls')),
]
from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
