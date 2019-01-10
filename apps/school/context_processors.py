from django.http import *
from apps.accounts.models import *


def school(request):
    request_path = request.path
    if request_path.startswith('/school'):
        try:
            school = School.objects.get(user=request.user)
        except School.DoesNotExist:
            raise Http404('This account is not linked to any school')
        return {'school': school}
    else:
        return {}

