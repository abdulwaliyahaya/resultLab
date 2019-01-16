from django.http import *
from apps.accounts.models import *


def school(request):
    request_path = request.path
    if request_path.startswith('/result'):
        try:
            school = School.objects.get(user=request.user)
        except School.DoesNotExist:
            raise Http404('This account is not linked to any result')
        return {'school': school}
    else:
        return {}

