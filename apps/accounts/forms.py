from django import forms


class SchoolRegistrationForm(forms.Form):
    username = forms.CharField(label='Username')
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    password_second = forms.CharField(label='Password', widget=forms.PasswordInput)
    email = forms.EmailField(label='Email Address')
    school_name = forms.CharField(label='School Name')
    address = forms.CharField(label='Office Address')


class PassWordRecoveryForm(forms.Form):
    email = forms.EmailField(label='Email Address')


class ChangePassWordForm(forms.Form):
    current_password = forms.CharField(label=' Current Password', widget=forms.PasswordInput)
    new_password = forms.CharField(label=' New Password', widget=forms.PasswordInput)
    reentered_password = forms.CharField(label=' Re-enter the New Password', widget=forms.PasswordInput)

