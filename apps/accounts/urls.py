"""resultlab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
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

from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from apps.accounts.views import *

urlpatterns = [
    path('login', LoginView.as_view(template_name='login.html'), name='login'),
    path('logout', LogoutView.as_view(template_name='logout.html'), name='logout'),
    path('login-redirect', login_redirect, name='login_redirect'),
    path('register-result', register_school, name='register-school'),
    path('registration-successful/<username>/', registration_successful, name='registration-complete'),
    path('recover-password', recover_password, name='recover_password'),
    path('change-password', change_password, name='change_password'),
    path('password-change-successful', password_change_successful, name='password-change-success')
]
