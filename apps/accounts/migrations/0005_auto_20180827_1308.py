# Generated by Django 2.1 on 2018-08-27 12:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20180824_1355'),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'db_table': 'Classes',
                'ordering': ['name'],
            },
        ),
        migrations.AlterField(
            model_name='school',
            name='current_term',
            field=models.CharField(choices=[('first term', 'First Term'), ('second term', 'Second Term'), ('third term', 'Third Term')], default='first term', max_length=50),
        ),
        migrations.AddField(
            model_name='class',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classes', to='accounts.School'),
        ),
    ]
