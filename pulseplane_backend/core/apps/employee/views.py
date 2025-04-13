from rest_framework import generics, status, views, permissions, viewsets
from rest_framework.response import Response
from .models import LeaveManagement, Feedback, WellnessCheck, RecognitionBadge, RecognitionAward
from .serializers import (
    LeaveManagementSerializer, LeaveManagementDetailSerializer, FeedbackSerializer, WellnessCheckSerializer,
    RecognitionBadgeSerializer, RecognitionAwardSerializer
)
from rest_framework import serializers
from django.conf import settings
from core.utils import EmailThread
from .email_template import leave_approve_template
import datetime
from django.db.models import Avg
from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

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

class FeedbackTodayView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    
    def get_queryset(self):
        today = datetime.date.today()
        return Feedback.objects.filter(created_at__date=today)

class WellnessCheckCreateView(generics.CreateAPIView):
    serializer_class = WellnessCheckSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WellnessCheckListView(generics.ListAPIView):
    serializer_class = WellnessCheckSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return WellnessCheck.objects.filter(user=user)

class TeamWellnessAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Only managers can view team wellness analytics
        if not request.user.is_manager and not request.user.is_staff:
            return Response({"error": "Not authorized to view team wellness."}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        # Get team members
        company = request.user.company
        if not company:
            return Response({"error": "No company associated with user."}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
        team_members = company.customuser_set.all()
        
        # Calculate averages for last 30 days
        thirty_days_ago = timezone.now().date() - timedelta(days=30)
        
        team_data = []
        company_avg = {
            'mood': 0,
            'stress_level': 0,
            'work_life_balance': 0,
            'total_users': 0
        }
        
        for member in team_members:
            wellness_checks = WellnessCheck.objects.filter(
                user=member,
                date__gte=thirty_days_ago
            )
            
            if wellness_checks.exists():
                avg_mood = wellness_checks.aggregate(Avg('mood'))['mood__avg']
                avg_stress = wellness_checks.aggregate(Avg('stress_level'))['stress_level__avg']
                avg_wlb = wellness_checks.aggregate(Avg('work_life_balance'))['work_life_balance__avg']
                
                member_data = {
                    'id': member.id,
                    'name': member.full_name,
                    'department': member.department,
                    'position': member.position,
                    'avg_mood': round(avg_mood, 2),
                    'avg_stress': round(avg_stress, 2),
                    'avg_work_life_balance': round(avg_wlb, 2),
                    'check_count': wellness_checks.count()
                }
                
                team_data.append(member_data)
                
                # Update company averages
                company_avg['mood'] += avg_mood
                company_avg['stress_level'] += avg_stress
                company_avg['work_life_balance'] += avg_wlb
                company_avg['total_users'] += 1
        
        # Calculate company averages
        if company_avg['total_users'] > 0:
            company_avg['mood'] = round(company_avg['mood'] / company_avg['total_users'], 2)
            company_avg['stress_level'] = round(company_avg['stress_level'] / company_avg['total_users'], 2)
            company_avg['work_life_balance'] = round(company_avg['work_life_balance'] / company_avg['total_users'], 2)
        
        return Response({
            'team_data': team_data,
            'company_averages': company_avg
        })

class RecognitionBadgeViewSet(viewsets.ModelViewSet):
    queryset = RecognitionBadge.objects.all()
    serializer_class = RecognitionBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class RecognitionAwardListCreateView(generics.ListCreateAPIView):
    serializer_class = RecognitionAwardSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Show public awards and ones involving the current user
        user = self.request.user
        return RecognitionAward.objects.filter(
            models.Q(public=True) | 
            models.Q(recipient=user) | 
            models.Q(giver=user)
        )
    
    def perform_create(self, serializer):
        serializer.save(giver=self.request.user)

class UserRecognitionStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, user_id=None):
        # Default to current user if no user_id provided
        target_user = request.user
        if user_id and (request.user.is_manager or request.user.is_staff):
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get recognition stats
        received_awards = RecognitionAward.objects.filter(recipient=target_user)
        given_awards = RecognitionAward.objects.filter(giver=target_user)
        
        # Calculate points
        total_points = sum(award.badge.points for award in received_awards)
        
        # Get top badges received
        badge_counts = {}
        for award in received_awards:
            badge_name = award.badge.name
            if badge_name in badge_counts:
                badge_counts[badge_name] += 1
            else:
                badge_counts[badge_name] = 1
        
        top_badges = [{"name": k, "count": v} for k, v in 
                      sorted(badge_counts.items(), key=lambda x: x[1], reverse=True)][:5]
        
        # Get recent awards
        recent_awards = RecognitionAwardSerializer(
            received_awards.order_by('-created_at')[:5], 
            many=True, 
            context={'request': request}
        ).data
        
        return Response({
            "user_id": target_user.id,
            "user_name": target_user.full_name,
            "total_received": received_awards.count(),
            "total_given": given_awards.count(),
            "total_points": total_points,
            "top_badges": top_badges,
            "recent_awards": recent_awards
        })