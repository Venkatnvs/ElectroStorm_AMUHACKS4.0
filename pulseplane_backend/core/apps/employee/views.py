from rest_framework import generics
from .models import LeaveManagement, Feedback
from .serializers import LeaveManagementSerializer, LeaveManagementDetailSerializer, FeedbackSerializer
from rest_framework import serializers
from django.conf import settings
from core.utils import EmailThread
from .email_template import leave_approve_template
import datetime

class LeaveManagementView(generics.ListCreateAPIView):
    queryset = LeaveManagement.objects.all()
    serializer_class = LeaveManagementSerializer

    def get_queryset(self):
        user = self.request.user
        return LeaveManagement.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        date = self.request.data.get('date')

        if LeaveManagement.objects.filter(user=user, date=date).exists():
            raise serializers.ValidationError("Leave already exists for this day.")
        
        serializer.save(user=self.request.user)

class LeaveManagementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveManagement.objects.all()
    serializer_class = LeaveManagementSerializer

class LeaveManagementsDetailedListView(generics.ListAPIView):
    queryset = LeaveManagement.objects.all()
    serializer_class = LeaveManagementDetailSerializer

    def get_queryset(self):
        company = self.request.user.company
        return LeaveManagement.objects.filter(user__company=company)

class LeaveManagementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveManagement.objects.all()
    serializer_class = LeaveManagementDetailSerializer

    def get_queryset(self):
        company = self.request.user.company
        return LeaveManagement.objects.filter(user__company=company)
    
    def perform_update(self, serializer):
        if self.request.data.get('approved') == True:
            data = serializer.save(approved=True)
        else:
            data = serializer.save(approved=False)
        user = data.user
        date = data.date
        self.send_email_to_user(user, date)

    def send_email_to_user(self, user, date):
        subject = f'Leave Approved on {settings.SITE_NAME}'
        message = leave_approve_template.format(
            full_name=user.full_name,
            site_name=settings.SITE_NAME,
            date=date
        )
        recipient_list = [user.email]
        email_thread = EmailThread(subject, message, recipient_list)
        email_thread.start()
class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    
class FeedbackListCreateView2(generics.ListCreateAPIView):
    today = datetime.date.today()
    queryset = Feedback.objects.filter(created_at__date=today)
    serializer_class = FeedbackSerializer