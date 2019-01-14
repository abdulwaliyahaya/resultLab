from django.http import HttpResponseRedirect, Http404
from django.urls import reverse
from apps.accounts.models import *


class LoginRequiredMiddleware:
    """middleware to redirect users not logged in to the login page"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/result'):
            if not request.user.is_authenticated:
                return HttpResponseRedirect(reverse('login'))
            else:
                # if authenticated... check if attached to a school object
                try:
                    school = School.objects.get(user=request.user)
                except School.DoesNotExist:
                    raise Http404('This account is not linked to any result')

        response = self.get_response(request)
        return response
