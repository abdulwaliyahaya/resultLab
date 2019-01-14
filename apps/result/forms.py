from django import forms


class SchoolNameLogoForm(forms.Form):
    logo = forms.ImageField(label='School Logo')
    name = forms.CharField(label='School Name')
    address = forms.CharField(label='School Address')
