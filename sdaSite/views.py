from django.contrib.auth import logout
from django.shortcuts import redirect, render


# Create your views here.
def home(request):
    return render(request, 'sdaSite/home.html')

def inscription(request):
    return render(request, 'sdaSite/inscription.html')

def connexion(request):
    return render(request, 'sdaSite/connexion.html')


def deconnexion(request):
    if request.method == 'POST':
        logout(request)
        return redirect('/')  # Redirige vers la page d'accueil après la déconnexion
    return render(request, 'sdaSite/deconnexion.html')

def profile(request):
    return render(request, 'sdaSite/profile.html')

def reservation(request):
    return render(request, 'sdaSite/reservation.html')

def reserved(request, id):
    return render(request, 'sdaSite/reserved.html', {'id': id})

# properties
def properties(request):
    return render(request, 'sdaSite/properties.html')

def details_property(request, id):
    return render(request, 'sdaSite/details.html', {'id': id})

def new_property(request):
    return render(request, 'sdaSite/new.html')

def edit_property(request, id):
    return render(request, 'sdaSite/edit.html', {'id': id})

def delete_property(request, id):
    return render(request, 'sdaSite/delete.html', {'id': id})

