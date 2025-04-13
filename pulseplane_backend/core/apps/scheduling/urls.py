from django.urls import path
from .views import (
    SchedulingListCreateView, 
    SchedulingRetrieveUpdateDestroyView, 
    SchedulingDetailedListCreateView, 
    SchedulingDetailedRetrieveUpdateDestroyView,
    SchedulingUserDeleteView,
    SchedulingDetailedListCreateView2
)
urlpatterns = [
    path('schedules/', SchedulingListCreateView.as_view(), name='schedule-list-create'),
    path('schedules/<int:pk>/', SchedulingRetrieveUpdateDestroyView.as_view(), name='schedule-detail'),

    path('detailed-schedules/', SchedulingDetailedListCreateView.as_view(), name='detailed-schedule-list-create'),
    path('detailed-schedules/<int:pk>/', SchedulingDetailedRetrieveUpdateDestroyView.as_view(), name='detailed-schedule-detail'),

    path('detailed-schedules2/', SchedulingDetailedListCreateView2.as_view(), name='detailed-schedule-list-create2'),

    path('schedules/<int:pk>/delete-user/', SchedulingUserDeleteView.as_view(), name='schedule-user-delete'),
]
