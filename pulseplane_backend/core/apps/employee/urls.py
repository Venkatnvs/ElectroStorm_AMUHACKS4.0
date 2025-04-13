from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LeaveManagementView,
    LeaveManagementDetailView,
    LeaveManagementsDetailedListView,
    LeaveManagementDetailView,
    FeedbackListCreateView,
    FeedbackDetailView,
    FeedbackListCreateView2,
    FeedbackTodayView,
    WellnessCheckCreateView,
    WellnessCheckListView,
    TeamWellnessAnalyticsView,
    RecognitionBadgeViewSet,
    RecognitionAwardListCreateView,
    UserRecognitionStatsView
)

router = DefaultRouter()
router.register('recognition/badges', RecognitionBadgeViewSet)

urlpatterns = [
    path('leaves/', LeaveManagementView.as_view(), name='leave-list-create'),
    path('leaves/<int:pk>/', LeaveManagementDetailView.as_view(), name='leave-detail'),

    path('leaves/detailed/', LeaveManagementsDetailedListView.as_view(), name='leave-detailed-list'),
    path('leaves/detailed/<int:pk>/', LeaveManagementDetailView.as_view(), name='leave-detailed-detail'),

    path('feedback/', FeedbackListCreateView.as_view(), name='feedback-list-create'),
    path('feedback/<int:pk>/', FeedbackDetailView.as_view(), name='feedback-detail'),

    path('feedback2/', FeedbackListCreateView2.as_view(), name='feedback-list-create2'),

    path('feedback/today/', FeedbackTodayView.as_view(), name='feedback-today'),

    # Wellness Tracking URLs
    path('wellness/', WellnessCheckCreateView.as_view(), name='wellness-create'),
    path('wellness/history/', WellnessCheckListView.as_view(), name='wellness-history'),
    path('wellness/analytics/', TeamWellnessAnalyticsView.as_view(), name='wellness-analytics'),

    # Recognition System URLs
    path('', include(router.urls)),
    path('recognition/awards/', RecognitionAwardListCreateView.as_view(), name='recognition-awards'),
    path('recognition/stats/', UserRecognitionStatsView.as_view(), name='recognition-stats'),
    path('recognition/stats/<int:user_id>/', UserRecognitionStatsView.as_view(), name='recognition-stats-user'),
]