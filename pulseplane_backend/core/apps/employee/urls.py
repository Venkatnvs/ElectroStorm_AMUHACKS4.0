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
    PeerRecognitionViewSet
)

# Create a router for viewsets
router = DefaultRouter()
router.register(r'recognitions', PeerRecognitionViewSet)

urlpatterns = [
    path('leaves/', LeaveManagementView.as_view(), name='leave-list-create'),
    path('leaves/<int:pk>/', LeaveManagementDetailView.as_view(), name='leave-detail'),

    path('leaves/detailed/', LeaveManagementsDetailedListView.as_view(), name='leave-detailed-list'),
    path('leaves/detailed/<int:pk>/', LeaveManagementDetailView.as_view(), name='leave-detailed-detail'),

    path('feedback/', FeedbackListCreateView.as_view(), name='feedback-list-create'),
    path('feedback/<int:pk>/', FeedbackDetailView.as_view(), name='feedback-detail'),

    path('feedback2/', FeedbackListCreateView2.as_view(), name='feedback-list-create2'),
    
    # Include the router URLs
    path('', include(router.urls)),
]