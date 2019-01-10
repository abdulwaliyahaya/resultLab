from django.db import models
from apps.accounts.models import *


class ResultSheet(models.Model):

    name = models.CharField(max_length=250)
    session = models.CharField(max_length=250)
    term = models.CharField(max_length=250)
    classz = models.ForeignKey(Class,
                               on_delete=models.CASCADE)
    school = models.ForeignKey(School,
                               on_delete=models.CASCADE)
    subjects = models.ManyToManyField(Subject)
    date_created = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'resultsheets'
        ordering = ['date_created']

    def __str__(self):
        return self.name


class StudentResultSheet(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    result_sheet = models.ForeignKey(ResultSheet,
                                     on_delete=models.CASCADE,
                                     related_name='result_sheet')
    position = models.IntegerField()
    total_score = models.IntegerField()
    average = models.FloatField()
    attendance = models.IntegerField()
    remark = models.CharField(max_length=300)
    date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'student_result_sheet'
        ordering = ['-date']

    def __str__(self):
        return self.user.username

    def pass_exam(self):
        if self.average > 45.0:
            return True
        else:
            return False


class StudentSubjectResult(models.Model):

    student_result_sheet = models.ForeignKey(StudentResultSheet,
                                             on_delete=models.CASCADE,
                                             related_name='student_sheet')
    subject = models.CharField(max_length=100)
    score = models.IntegerField()
    position = models.IntegerField()

    class Meta:
        db_table = 'subject_result'
