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
from apps.school.views import *
urlpatterns = [
    path('', overview, name='school-overview'),
    path('result', result_home, name='result-home'),
    path('process-result', process_result, name='process-result'),
    path('result-list', result_list, name='result-list'),
    path('result/<int:result_id>/', class_result, name='class-result'),
    path('result/<int:result_id>/ajax', class_result_data, name='class-result-data'),
    path('student', student_home, name='student-home'),
    path('student-list', student_list, name='student-list'),
    path('student/<str:student_id>/', student_results, name='student-results'),
    path('student/<str:student_id>/ajax/', student_results_ajax, name='student-results-ajax'),
    path('student/<str:student_id>/ajax/specific', student_results_ajax_specific, name='student-results-ajax-specific'),
    path('add-student', add_student, name='add-student'),
    path('add-students', add_students, name='add-students'),
    path('promote-students', promote_students, name='promote-students'),
    path('get-results', get_result, name='get-result'),
    path('delete-results', delete_results, name='delete-results'),
    path('remove-students', remove_students, name='remove-students'),
    path('get-student-list', get_student_list, name='get-student-list'),
    path('setting', setting_home, name='setting-home'),
    path('post-name-logo', set_logo_name, name='name-logo'),
    path('update-current-term', update_current_term_ui, name='update-current-term'),
    path('set-current-term', set_current_term, name='set-current-term'),
    path('add-subject', add_subject, name='add-subject'),
    path('remove-subject', remove_subject, name='remove-subject'),
    path('add-class', add_class, name='add-class'),
    path('remove-class', remove_class, name='remove-class'),
]
