from apps.accounts.models import *
from apps.result.models import *


def write_to_database(result_sheet, student_result):
    student = student_result['student']
    overall_result = student_result['overall_result']
    subject_result = student_result['subject_result']
    user = User.objects.get(username=student)
    student_overall_performance = StudentResultSheet(user=user,
                                                     result_sheet=result_sheet,
                                                     position=overall_result['position'],
                                                     total_score=overall_result['total_score'],
                                                     average=overall_result['average'],
                                                     attendance=overall_result['attendance'],
                                                     remark=overall_result['remark'])
    student_overall_performance.save()
    subjects_data = [StudentSubjectResult(student_result_sheet=student_overall_performance,
                                          subject=subject, score=info['score'], position=info['position'])
                     for subject, info in subject_result.items()]
    StudentSubjectResult.objects.bulk_create(subjects_data)


def get_percentage_pass_fail(results):
    total = len(results)
    percentages = {'pass': 0, 'fail': 0}
    for result in results:
        if result.pass_exam():
            percentages['pass'] += 1
        else:
            percentages['fail'] += 1
    percentages['pass'] = str(round((percentages['pass'] / total) * 100, 2)) + '%'
    percentages['fail'] = str(round((percentages['fail'] / total) * 100, 2)) + '%'
    return percentages
