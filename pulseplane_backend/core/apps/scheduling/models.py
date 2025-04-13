from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SHIFT_TYPES(models.TextChoices):
    MORNING = 'MORNING', 'Morning'
    AFTERNOON = 'AFTERNOON', 'Afternoon'
    NIGHT = 'NIGHT', 'Night'

class PRIORITY_CHOICES(models.TextChoices):
    HIGH = 'HIGH', 'High'
    MEDIUM = 'MEDIUM', 'Medium'
    LOW = 'LOW', 'Low'

class Scheduling(models.Model):
    user = models.ManyToManyField(User)
    date = models.DateField(null=True, blank=True)
    shift_type = models.CharField(max_length=10, choices=SHIFT_TYPES.choices, default=SHIFT_TYPES.MORNING)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES.choices, default=PRIORITY_CHOICES.MEDIUM)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'start_time']

    def __str__(self):
        return f'{self.date} - {self.shift_type}'