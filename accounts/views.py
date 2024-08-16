from django.shortcuts import render
from django.views.generic import TemplateView

class LogoutView(TemplateView):
    template_name = 'registration/logout.html'
    
    def get(self, request):
        return render(request, self.template_name)
    
    def post(self, request):
        return render(request, self.template_name)
