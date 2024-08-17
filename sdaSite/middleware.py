from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

class AuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Liste des chemins publics (ne nécessitant pas d'authentification)
        public_paths = ['/connexion/', '/logout/', '/']
        if not request.path.startswith(tuple(public_paths)) and not request.user.is_authenticated:
            return redirect('sdaSite:connexion')
