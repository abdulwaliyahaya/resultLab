from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    SCHOOL = 'result'
    STUDENT = 'student'
    USERTYPES = ((SCHOOL, 'School'),
                 (STUDENT, 'Student')
                 )
    usertype = models.CharField(max_length=20, choices=USERTYPES)

    class Meta:
        db_table = 'Users'
        ordering = ['username']

    def __str__(self):
        return self.username


class School(models.Model):
    FIRST = 'first term'
    SECOND = 'second term'
    THIRD = 'third term'
    TERMS = ((FIRST, 'First Term'),
             (SECOND, 'Second Term'),
             (THIRD, 'Third Term')
             )
    user = models.OneToOneField(User,
                                on_delete=models.CASCADE,
                                related_name='result')
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='result/logo/%Y/%m/%d/')
    wallet = models.FloatField(default=0.00)
    date = models.DateTimeField(auto_now_add=True)
    current_term = models.CharField(max_length=50, default='first term', choices=TERMS)
    current_session = models.CharField(max_length=100)

    class Meta:
        db_table = 'Schools'
        ordering = ['date']

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=50,
                            unique=True)
    school = models.ForeignKey(School,
                               on_delete=models.CASCADE,
                               related_name='subjects')

    class Meta:
        db_table = 'Subjects'
        ordering = ['name']

    def __str__(self):
        return self.name


class Class(models.Model):
    name = models.CharField(max_length=50,
                            unique=True)
    school = models.ForeignKey(School,
                               on_delete=models.CASCADE,
                               related_name='classes')

    class Meta:
        db_table = 'Classes'
        ordering = ['name']

    def __str__(self):
        return self.name


class Student(models.Model):
    MALE = 'MALE'
    FEMALE = 'FEMALE'
    GENDER = ((MALE, 'Male'),
              (FEMALE, 'Female')
              )
    user = models.OneToOneField(User,
                                on_delete=models.CASCADE,
                                related_name='user_students')
    gender = models.CharField(max_length=20, choices=GENDER)
    student_class = models.ForeignKey(Class,
                                      on_delete=models.CASCADE,
                                      related_name='class_students')
    school = models.ForeignKey(School,
                               on_delete=models.CASCADE,
                               related_name='students')
    home_address = models.CharField(max_length=100)
    parent_phone = models.IntegerField()
    passport = models.ImageField(upload_to='student/passport/%Y/%m/%d/',
                                 null=True,
                                 blank=True)

    class Meta:
        db_table = 'students'

    def __str__(self):
        return self.user.get_full_name()
