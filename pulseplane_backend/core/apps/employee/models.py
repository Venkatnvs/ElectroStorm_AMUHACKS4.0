from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class LeaveManagement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True, null=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'date']

    def __str__(self):
        return f"Leave: {self.user.email} on {self.date}"
    
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    feedback = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback: {self.user.email}"

class WellnessCheck(models.Model):
    MOOD_CHOICES = [
        (1, 'Very Low'),
        (2, 'Low'),
        (3, 'Neutral'),
        (4, 'Good'),
        (5, 'Excellent')
    ]
    
    STRESS_LEVEL_CHOICES = [
        (1, 'No Stress'),
        (2, 'Mild'),
        (3, 'Moderate'),
        (4, 'High'),
        (5, 'Severe')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wellness_checks')
    date = models.DateField(auto_now_add=True)
    mood = models.IntegerField(choices=MOOD_CHOICES)
    stress_level = models.IntegerField(choices=STRESS_LEVEL_CHOICES)
    sleep_hours = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    work_life_balance = models.IntegerField(choices=MOOD_CHOICES)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Wellness Check: {self.user.email} on {self.date}"

class RecognitionBadge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, help_text="FontAwesome icon class")
    points = models.IntegerField(default=10)
    
    def __str__(self):
        return self.name

class RecognitionAward(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_awards')
    giver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_awards')
    badge = models.ForeignKey(RecognitionBadge, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    public = models.BooleanField(default=True, help_text="Whether this award is publicly visible")
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.giver.full_name} recognized {self.recipient.full_name} with {self.badge.name}"
    
    def save(self, *args, **kwargs):
        # Prevent self-recognition
        if self.recipient == self.giver:
            raise models.ValidationError("You cannot give yourself a recognition award.")
            
        super().save(*args, **kwargs)