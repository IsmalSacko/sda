from django.contrib.auth import logout
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMessage
from django.http import HttpResponse


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


def apropos(request):
    return render(request, 'sdaSite/apropos.html')



def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        subject = 'Nouveau message de contact'
        body = f"Nom: {name}\nEmail: {email}\n\nMessage:\n{message}"
        
        # Liste des destinataires
        recipients = ['mamadoumsacko365@icloud.com', 'ismalsacko@yahoo.fr']

        try:
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email=settings.EMAIL_HOST_USER,
                headers={'Reply-To': email}, # Ajouter l'adresse e-mail du répondant
                to=recipients
            )
            email.send()
            return redirect('sdaSite:contact_success') # Redirige vers la page de succès après l'envoi du message
        except Exception as e:
            return HttpResponse(f"Une erreur est survenue : {e}")
        
    return render(request, 'sdaSite/contact.html')


def contact_success(request):
    return render(request, 'sdaSite/contact_success.html')
