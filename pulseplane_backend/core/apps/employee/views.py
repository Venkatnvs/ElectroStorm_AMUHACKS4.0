from rest_framework import generics, viewsets, permissions, status
from .models import LeaveManagement, Feedback, PeerRecognition
from .serializers import LeaveManagementSerializer, LeaveManagementDetailSerializer, FeedbackSerializer, PeerRecognitionCreateSerializer, PeerRecognitionDetailSerializer
from rest_framework import serializers
from django.conf import settings
from core.utils import EmailThread
from .email_template import leave_approve_template
import datetime
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import action
from django.contrib.auth import get_user_model

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

class PeerRecognitionViewSet(viewsets.ModelViewSet):
    queryset = PeerRecognition.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PeerRecognitionCreateSerializer
        return PeerRecognitionDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Filter based on visibility settings
        if user.role == 'admin':
            # Admins can see all recognitions
            return PeerRecognition.objects.all()
        else:
            # Regular users can see public recognitions or those they're involved in
            return PeerRecognition.objects.filter(
                Q(is_public=True) | 
                Q(sender=user) | 
                Q(recipient=user)
            )
    
    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Get recognitions sent by the current user"""
        recognitions = PeerRecognition.objects.filter(sender=request.user)
        serializer = PeerRecognitionDetailSerializer(recognitions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """Get recognitions received by the current user"""
        recognitions = PeerRecognition.objects.filter(recipient=request.user)
        serializer = PeerRecognitionDetailSerializer(recognitions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def company_highlights(self, request):
        """Get public recognitions for the company dashboard"""
        if request.user.company:
            users_in_company = get_user_model().objects.filter(company=request.user.company)
            recent_recognitions = PeerRecognition.objects.filter(
                sender__in=users_in_company,
                recipient__in=users_in_company,
                is_public=True
            ).order_by('-created_at')[:10]
            
            serializer = PeerRecognitionDetailSerializer(recent_recognitions, many=True)
            return Response(serializer.data)
        return Response([], status=status.HTTP_200_OK)