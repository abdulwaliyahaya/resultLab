# Generated by Django 2.1 on 2018-10-06 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_student_gender'),
        ('result', '0004_resultsheet_school'),
    ]

    operations = [
        migrations.AddField(
            model_name='resultsheet',
            name='subjects',
            field=models.ManyToManyField(to='accounts.Subject'),
        ),
    ]
