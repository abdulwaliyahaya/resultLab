from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.forms import AuthenticationForm


def home_page(request):
    user = request.user
    if user.is_authenticated:
        return redirect(reverse('login_redirect'))
    else:
        context = {
            'login_form': AuthenticationForm
        }
        return render(request, 'homepage.html', context)

