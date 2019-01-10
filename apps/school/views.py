import json
from django.shortcuts import render
from django.http import *
from django.db.models import Q
from apps.accounts.models import *
from apps.school.models import *
from django.db import IntegrityError
from django.core.paginator import Paginator
from apps.school.forms import *
from scripts import result as rs, utils


def overview(request):
    school = School.objects.get(user=request.user)
    result_sheets = ResultSheet.objects.filter(school=school)
    student_results = []
    # get student result sheet from master result sheet and add to student_results list
    for sheet in result_sheets:
        sheets_in_result_sheet = sheet.result_sheet.all()
        for i in sheets_in_result_sheet:
            student_results.append(i)
    percentages_pass_fail = utils.get_percentage_pass_fail(student_results)
    students = Student.objects.filter(school=school)
    student_count = students.count()

    male_student_percent = str(round((students.filter(gender='MALE').count() / student_count) * 100, 2)) + '%'
    female_student_percent = str(round((students.filter(gender='FEMALE').count() / student_count) * 100, 2)) + '%'
    context = {
        'student_count': student_count,
        'percentages_pass_fail': percentages_pass_fail,
        'male_student_percent': male_student_percent,
        'female_student_percent': female_student_percent
    }

    return render(request, 'home.html', context)


def result_home(request):
    return render(request, 'result.html', {})


def process_result(request):
    request_data = json.loads(request.body)
    result_data = request_data['result']
    result_data[0].pop(0)
    session = request_data['session']
    term = request_data['term']
    classz = request_data['classz']
    classz = Class.objects.get(name=classz)
    result = rs.Compiler(result_data)
    result_sheet = ResultSheet(name='{} {} {}'.format(classz, term, session),
                               session=session,
                               term=term,
                               classz=classz,
                               school=School.objects.get(user=request.user))
    result_sheet.save()
    for subject in result.subject_list:
        result_sheet.subjects.add(Subject.objects.get(school=School.objects.get(user=request.user), name=subject))
    result_sheet.save()
    # enter student data into database
    for student in result.student_list:
        student_result = result.specific_student_result(student)
        utils.write_to_database(result_sheet, student_result)
    return HttpResponse('Successful...')


def delete_results(request):
    result_list = json.loads(request.body)['resultList']
    school = School.objects.get(user=request.user)
    for result in result_list:
        result = ResultSheet.objects.get(school=school, name=result)
        result.delete()
    return HttpResponse('deleted successfully')


def result_list(request):
    return render(request, 'result-list.html', {})


def class_result(request, result_id):
    result_sheet = ResultSheet.objects.get(school=School.objects.get(user=request.user), id=result_id)
    school_name = School.objects.get(user=request.user).name
    classz = result_sheet.classz
    term = result_sheet.term
    session = result_sheet.session
    date = result_sheet.date_created
    subjects = [subject.name for subject in result_sheet.subjects.all()]
    context = {
        'subjects': subjects,
        'school_name': school_name,
        'term': term,
        'session': session,
        'date': date,
        'classz': classz
    }
    return render(request, 'indidual-result.html', context)


def class_result_data(request, result_id):
    result_sheet = ResultSheet.objects.get(school=School.objects.get(user=request.user), id=result_id)
    subjects = [subject.name for subject in result_sheet.subjects.all()]
    student_result_sheet = StudentResultSheet.objects.filter(result_sheet=result_sheet)
    results = []
    for student_result in student_result_sheet:
        total_score = student_result.total_score
        position = student_result.position
        average = student_result.average
        attendance = student_result.attendance
        remark = student_result.remark
        overall_data = [total_score, average, position, attendance, remark]
        subject_results = student_result.student_sheet.all()
        student_data = []
        for subject in subject_results:
            pos = subject.position
            sub_score = subject.score
            student_data.append(sub_score)
            student_data.append(pos)
        student_data.extend(overall_data)
        student_data.insert(0, student_result.user.get_full_name())
        student_data.insert(0, student_result.user.username)
        results.append(student_data)
    for num, result in enumerate(results, start=1):
        results[num - 1].insert(0, num)
    data = {
        'results': results,
        'subjects': subjects
    }
    return JsonResponse(data)


def get_result(request):
    body = json.loads(request.body)
    classz = body['classz']
    req_class = classz
    page = body['page']
    ITEMS_PER_PAGE = 50
    if classz:
        result_list = ResultSheet.objects.filter(school=School.objects.get(user=request.user),
                                                 classz=Class.objects.get(school=School.objects.get(user=request.user),
                                                                          name=classz))
    if not classz:
        result_list = ResultSheet.objects.filter(school=School.objects.get(user=request.user))
        req_class = ''

    results = []
    for result in result_list:
        name = result.name
        session = result.session
        term = result.term
        classz = result.classz.name
        result_id = result.id
        individual_results = [name, classz, term, session, result_id]
        results.append(individual_results)
    for num, result in enumerate(results, start=1):
        results[num - 1].insert(0, num)
    paging = Paginator(results, ITEMS_PER_PAGE)
    num_of_pages = paging.num_pages
    requested_page = page
    result_list = paging.page(page)
    result_list = result_list.object_list
    data = {
        'num_of_pages': num_of_pages,
        'requested_page': requested_page,
        'results': result_list,
        'classz': req_class
    }
    return JsonResponse(data)


def get_student_list(request):
    student_class = json.loads(request.body)['studentClass']
    school = School.objects.get(user=request.user)
    school_class = Class.objects.get(school=school, name=student_class)
    students = Student.objects.filter(school=school, student_class=school_class)
    student_list = [student.user.username for student in students]
    return JsonResponse(student_list, safe=False)


def student_home(request):
    return render(request, 'student.html', {})


def student_list(request):
    data = json.loads(request.body)
    query = data['query']
    page = data['page']
    classz = data['classz']
    ITEMS = 50
    try:
        school = School.objects.get(user=request.user)
    except School.DoesNotExist:
        raise Http404("This account is not linked to any school")
    if query == '' and classz == '':
        students = Student.objects.filter(school=school)
    if query:
        students = Student.objects.filter(Q(user__first_name__istartswith=query) | Q(user__last_name__istartswith=query)
                                          )
    if classz:
        clas = Class.objects.get(school=school, name=classz)
        students = Student.objects.filter(school=school, student_class=clas)
    if query and classz:
        clas = Class.objects.get(school=school, name=classz)
        students = Student.objects.filter(
                                          Q(user__first_name__istartswith=query
                                            ) | Q(user__last_name__istartswith=query
                                                  )).filter(school=school, student_class=clas)
    student_list = []
    for student in students:
        user = student.user
        reg_number = user.username
        full_name = user.get_full_name()
        gender = student.gender
        clasz = student.student_class.name
        student_details = [reg_number, full_name, gender, clasz]
        student_list.append(student_details)
    for num, i in enumerate(student_list, start=1):
        student_list[num - 1].insert(0, num)
    paging = Paginator(student_list, ITEMS)
    num_of_pages = paging.num_pages
    requested_page = page
    students = paging.page(page)
    students = students.object_list
    data = {
        'num_of_pages': num_of_pages,
        'requested_page': requested_page,
        'students': students,
        'query': query,
        'classz': classz
    }
    return JsonResponse(data)


def add_student(request):
    reg_id = request.POST['reg_id']
    first_name = request.POST['first_name']
    last_name = request.POST['last_name']
    email = request.POST['email']
    gender = request.POST['gender']
    classz = request.POST['classz']
    address = request.POST['address']
    parent_phone = request.POST['parent_phone']
    user = User.objects.create_user(username=reg_id, email=email, password='12345678')
    user.first_name = first_name
    user.last_name = last_name
    user.usertype = 'student'
    user.save()
    school = School.objects.get(user=request.user)
    clazz = Class.objects.get(school=school, name=classz)
    student = Student(user=user, gender=gender, student_class=clazz, school=school,
                      home_address=address, parent_phone=parent_phone)
    student.save()

    return HttpResponse('successful')


def add_students(request):
    classz = request.POST['classz']
    school = School.objects.get(user=request.user)
    clazz = Class.objects.get(school=school, name=classz)
    csvfile = request.FILES['csvfile']
    for line in csvfile.open().readlines()[1:]:
        student_row = line.decode('utf-8')
        student_row = student_row.split(',')
        reg_id = student_row[0]
        first_name = student_row[1]
        last_name = student_row[2]
        email = student_row[3]
        gender = student_row[4]
        address = student_row[5]
        phone = student_row[6]
        try:
            user = User.objects.create_user(username=reg_id, email=email, password='12345678')
            user.first_name = first_name
            user.last_name = last_name
            user.usertype = 'student'
            user.save()
            student = Student(user=user, gender=gender, student_class=clazz, school=school,
                              home_address=address, parent_phone=phone)
            student.save()
        except IntegrityError:
            pass

    return HttpResponse('Successful...')


def promote_students(request):
    students_not_promoting = request.POST['repeatingStudents'].split(',')
    school = School.objects.get(user=request.user)
    students = Student.objects.get(school=school)
    for student in students:
        pass
    # TODO: Come up with a way to promote students by giving weight to student class
    return HttpResponse('suc')


def remove_students(request):
    reg_ids = json.loads(request.body)['studentDeleteList']
    school = School.objects.get(user=request.user)
    for reg_id in reg_ids:
        user = User.objects.get(username=reg_id)
        student_to_delete = Student.objects.get(user=user, school=school)
        student_to_delete.delete()

    return HttpResponse('Successful')


def student_results(request, student_id):
    student_user = User.objects.get(username=student_id, usertype='student')
    context = {
        'student': student_user
    }

    return render(request, 'student-results.html', context)


def student_results_ajax(request, student_id):
    student_user = User.objects.get(username=student_id, usertype='student')
    result_sheets = StudentResultSheet.objects.filter(user=student_user)
    results = []
    for sheet in result_sheets:
        main_result_sheet = sheet.result_sheet
        sheet_data = [main_result_sheet.id,
                      main_result_sheet.name,
                      main_result_sheet.classz.name,
                      main_result_sheet.term,
                      main_result_sheet.session]
        results.append(sheet_data)
    for num, result in enumerate(results, start=1):
        results[num - 1].insert(0, num)
    return JsonResponse(results, safe=False)


def student_results_ajax_specific(request, student_id):
    request_data = json.loads(request.body)
    school = School.objects.get(user=request.user)
    student_user = User.objects.get(username=student_id, usertype='student')
    result = ResultSheet.objects.get(id=request_data['resultID'], school=school)
    student_result = result.result_sheet.get(user=student_user)
    total_student = result.result_sheet.count()
    subject_results = student_result.student_sheet.all()
    subjects_data = []
    for subject in subject_results:
        subjects_data.append([subject.subject, subject.score, subject.position])
    overall_performance = {
        'student_count': total_student,
        'score': student_result.total_score,
        'position': student_result.position,
        'average': student_result.average,
        'attendance': student_result.attendance,
        'remark': student_result.remark,
        'date': student_result.date
    }
    data = {
        'subjects': subjects_data,
        'overall_performance': overall_performance
    }
    return JsonResponse(data)


def setting_home(request):
    context = {
        'name_logo_form': SchoolNameLogoForm
    }
    return render(request, 'setting.html', context)


def set_logo_name(request):
    name = request.POST['name']
    address = request.POST['address']
    try:
        logo = request.FILES['logo']
    except:
        logo = None
    user = request.user
    try:
        school = School.objects.get(user=user)
    except School.DoesNotExist:
        raise Http404("This account is not linked to any school")
    school.name = name
    school.address = address
    if logo is not None:
        school.logo = logo
    school.save()
    if school.logo:
        img = school.logo.url
    else:
        img = ''
    data = {
        'img': img
    }
    return JsonResponse(data)


def update_current_term_ui(request):
    try:
        school = School.objects.get(user=request.user)
    except School.DoesNotExist:
        pass
    current_term = school.current_term
    current_session = school.current_session
    data = {
        'current_term': current_term,
        'current_session': current_session
    }
    return JsonResponse(data)


def set_current_term(request):
    data = json.loads(request.body)
    current_term = data['current_term']
    current_session = data['current_session']
    try:
        school = School.objects.get(user=request.user)
    except School.DoesNotExist:
        raise Http404('This account is not linked to any school')
    school.current_term = current_term
    school.current_session = current_session
    school.save()
    return HttpResponse('Current Session/Term have been updated')


def add_subject(request):
    data = json.loads(request.body)
    new_subject_name = data['subjectFieldValue'].strip().upper()
    school = School.objects.get(user=request.user)
    try:
        new_subject = Subject(name=new_subject_name, school=school)
        new_subject.save()
    except IntegrityError:
        data = {
            'response': '{} already in your subject list'.format(new_subject_name),
            'subjects': ''
        }
        return JsonResponse(data)
    school_subjects = Subject.objects.filter(school=school).values('name')
    subject_list = [sub[1] for subject in school_subjects for sub in subject.items()]
    subject_list.sort()
    data = {
        'response': '{} had been added successfully'.format(new_subject),
        'subjects': subject_list
    }
    return JsonResponse(data)


def remove_subject(request):
    data = json.loads(request.body)
    subject_to_remove = data['subject']
    school = School.objects.get(user=request.user)
    subject = Subject.objects.get(name=subject_to_remove, school=school)
    subject.delete()
    school_subjects = Subject.objects.filter(school=school).values('name')
    subject_list = [sub[1] for subject in school_subjects for sub in subject.items()]
    subject_list.sort()
    data = {
        'response': '{} had been removed successfully'.format(subject_to_remove),
        'subjects': subject_list
    }
    return JsonResponse(data)


def add_class(request):
    data = json.loads(request.body)
    new_class_name = data['classFieldValue'].strip().upper()
    school = School.objects.get(user=request.user)
    try:
        new_class = Class(name=new_class_name, school=school)
        new_class.save()
    except IntegrityError:
        data = {
            'response': '{} already in your class list'.format(new_class_name),
            'classes': ''
        }
        return JsonResponse(data)
    school_classes = Class.objects.filter(school=school).values('name')
    class_list = [sub[1] for classz in school_classes for sub in classz.items()]
    class_list.sort()
    data = {
        'response': '{} had been added successfully'.format(new_class),
        'classes': class_list
    }
    return JsonResponse(data)


def remove_class(request):
    data = json.loads(request.body)
    class_to_remove = data['class']
    school = School.objects.get(user=request.user)
    classz = Class.objects.get(name=class_to_remove, school=school)
    classz.delete()
    school_classes = Class.objects.filter(school=school).values('name')
    class_list = [sub[1] for classz in school_classes for sub in classz.items()]
    class_list.sort()
    data = {
        'response': '{} had been removed successfully'.format(class_to_remove),
        'classes': class_list
    }
    return JsonResponse(data)
