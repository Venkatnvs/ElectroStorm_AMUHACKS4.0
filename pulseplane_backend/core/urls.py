from django.urls import path, include
from .views import EmployeeListCreateView, EmployeeRetrieveUpdateDestroyView, DashboardView, DashboardGraphData, DashboardView2
urlpatterns = [
    path('sheduling/', include('core.apps.scheduling.urls')),
    path('emp/', include('core.apps.employee.urls')),

    path('dashboard/data-count/', DashboardView.as_view(), name='dashboard'),
    path('dashboard/data-count2/', DashboardView2.as_view(), name='dashboard2'),
    path('dashboard/graph-data/', DashboardGraphData.as_view(), name='dashboard-graph-data'),

    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeRetrieveUpdateDestroyView.as_view(), name='employee-retrieve-update-destroy'),
]
