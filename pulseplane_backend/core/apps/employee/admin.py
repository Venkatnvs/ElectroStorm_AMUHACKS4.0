from django.contrib import admin
from .models import LeaveManagement, Feedback, PeerRecognition

admin.site.register(LeaveManagement)
admin.site.register(Feedback)
admin.site.register(PeerRecognition)