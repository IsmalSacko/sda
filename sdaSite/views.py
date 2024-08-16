from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'sdaSite/home.html')

def inscription(request):
    return render(request, 'sdaSite/inscription.html')

def connexion(request):
    return render(request, 'sdaSite/connexion.html')

def deconnexion(request):
    return render(request, 'sdaSite/deconnexion.html')

def profile(request):
    return render(request, 'sdaSite/profile.html')

def reservation(request):
    return render(request, 'sdaSite/reservation.html')

def reserved(request, id):
    return render(request, 'sdaSite/reserved.html', {'id': id})
