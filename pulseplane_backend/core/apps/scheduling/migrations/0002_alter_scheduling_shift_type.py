# Generated by Django 4.2.16 on 2024-10-26 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduling', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scheduling',
            name='shift_type',
            field=models.CharField(choices=[('MORNING', 'Morning'), ('AFTERNOON', 'Afternoon'), ('NIGHT', 'Night')], default='MORNING', max_length=10),
        ),
    ]
