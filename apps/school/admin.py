from django.contrib import admin
from apps.school.models import *
from apps.accounts.models import *

admin.site.register(Subject)
admin.site.register(Class)
admin.site.register(ResultSheet)
admin.site.register(StudentResultSheet)
admin.site.register(StudentSubjectResult)
