from django.shortcuts import render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.http import *
from django.urls import reverse
from apps.accounts.models import *
from apps.accounts.forms import *


@login_required
def login_redirect(request):
    user = request.user
    if user.usertype == 'school':
        return redirect(reverse('school-overview'))
    elif user.usertype == 'student':
        return redirect(reverse(''))
    else:
        return HttpResponse(" We don't have an idea of your user type, \
                                contact the admin")


def register_school(request):
    if request.method == 'POST':
        form = SchoolRegistrationForm(request.POST)
        if form.is_valid():
            cleaned = form.cleaned_data
            username = cleaned['username']
            password = cleaned['password']
            email = cleaned['email']
            school_name = cleaned['school_name']
            address = cleaned['address']
            user = User.objects.create_user(username=username,
                                            email=email,
                                            password=password)
            user.usertype = 'result'
            user.save()
            school = School(user=user,
                            name=school_name,
                            address=address,
                            )
            school.save()
            return redirect(reverse('registration-complete', kwargs={'username': username}))
    else:
        form = SchoolRegistrationForm
        return render(request, 'registration.html', {'form': form})


def registration_successful(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User not found')
    try:
        school = School.objects.get(user=user)
    except School.DoesNotExist:
        raise Http404("School not found, contact the Admin!")
    context = {
        'username': username,
        'name': school.name
    }
    return render(request, 'registration-complete.html', context)


def recover_password(request):
    if request.method == 'POST':
        # TODO: work on the remaining part of this block
        pass
    else:
        form = PassWordRecoveryForm
        context = {
            'form': form
        }
        return render(request, 'forgot-password.html', context)


@login_required
def change_password(request):
    if request.method == 'POST':
        form = ChangePassWordForm(request.POST)
        if form.is_valid():
            cleaned = form.cleaned_data
            current_password = cleaned['current_password']
            new_password = cleaned['new_password']
            reentered_password = cleaned['reentered_password']
            user = User.objects.get(pk=request.user.pk)
            if user.check_password(current_password):
                if new_password == reentered_password:
                    user.set_password(new_password)
                    user.save()
                    update_session_auth_hash(request, user)
                    return redirect(reverse('password-change-success'))
                else:
                    return render(request, 'change-password.html', {'form': form,
                                                                             'error': 'new password and re-entered \
                                                                             password not the same, correct it'})
            else:
                return render(request, 'change-password.html', {'form': form,
                                                                         'error': 'You entered a wrong current \
                                                                         password'})
    else:
        form = ChangePassWordForm
        context = {
            'form': form
        }
        return render(request, 'change-password.html', context)


@login_required
def password_change_successful(request):
    return render(request, 'password-change-success.html', {})
