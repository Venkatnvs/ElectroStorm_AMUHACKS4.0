# Generated by Django 4.2.16 on 2024-10-26 21:14

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('scheduling', '0002_alter_scheduling_shift_type'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='scheduling',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='scheduling',
            name='user',
        ),
        migrations.AddField(
            model_name='scheduling',
            name='user',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
