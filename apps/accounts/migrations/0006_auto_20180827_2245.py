# Generated by Django 2.1 on 2018-08-27 21:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20180827_1308'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school',
            name='current_term',
            field=models.CharField(max_length=100),
        ),
    ]