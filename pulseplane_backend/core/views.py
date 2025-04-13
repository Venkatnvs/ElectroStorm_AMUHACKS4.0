from rest_framework import generics, permissions
from .serializers import EmployeeSerializer, DashBoardSerializer, DashBoardGraphSerializer, DashBoardSerializer2
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from core.apps.scheduling.models import Scheduling
from core.apps.employee.models import LeaveManagement, Feedback
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Count, Sum, F, FloatField, ExpressionWrapper, Avg


User = get_user_model()

class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.filter(is_manager=False)
    serializer_class = EmployeeSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class EmployeeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(is_manager=False)
    serializer_class = EmployeeSerializer

    def perform_update(self, serializer):
        cr = self.request.data.get('current_shifts_count', 0)
        if cr:
            data = serializer.save(current_shifts_count=cr)
        else:
            data = serializer.save()
        data.save()
        return data
        

class DashboardView(generics.GenericAPIView):
    permissions = [permissions.IsAuthenticated,]
    serializer_class = DashBoardSerializer

    def get_dashboard_data(self, user, start_date, end_date):
        today = datetime.now().date()
        number_of_employees = User.objects.filter(company=user.company, is_manager=False).count()
        leaves = LeaveManagement.objects.filter(date = today, approved=True).count()
        number_of_present_employees = number_of_employees - leaves
        number_of_absent_employees = leaves
        new_hiring_applications = 0
        total_salary = User.objects.filter(
            company=user.company,
            is_manager=False,
            salary__isnull=False
        ).aggregate(total_salary=Sum('salary'))['total_salary']
        total_payroll = User.objects.filter(
            company=user.company,
            is_manager=False,
            salary__isnull=False,
            no_of_shifts__isnull=False,
            current_shifts_count__isnull=False
        ).aggregate(
            total_payroll=Sum(
                ExpressionWrapper(
                    (F('salary') / F('no_of_shifts')) * F('current_shifts_count'),
                    output_field=FloatField()
                )
            )
        )['total_payroll']

        return {
            'number_of_employees': number_of_employees,
            'number_of_present_employees': number_of_present_employees,
            'number_of_absent_employees': number_of_absent_employees,
            'new_hiring_applications': new_hiring_applications,
            'total_salary': total_salary,
            'total_payroll': total_payroll
        }

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'start_date', 
                openapi.IN_QUERY, 
                description="Start date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            ),
            openapi.Parameter(
                'end_date', 
                openapi.IN_QUERY, 
                description="End date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=datetime.now().strftime('%Y-%m-%d')
            ),
        ]
    )
    def get(self, request):
        user = request.user
        end_date = request.query_params.get('end_date', datetime.now().date())
        start_date = request.query_params.get('start_date', (datetime.now() - timedelta(days=30)).date())
        if isinstance(end_date, str):
            end_date = make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
        if isinstance(start_date, str):
            start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        try:
            dashboard_data = self.get_dashboard_data(user, start_date, end_date)
            serialized_data = self.serializer_class(data=dashboard_data)
            if serialized_data.is_valid():
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            else:
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class DashboardView2(generics.GenericAPIView):
    permissions = [permissions.IsAuthenticated,]
    serializer_class = DashBoardSerializer2

    def get_dashboard_data(self, user, start_date, end_date):
        leaves = LeaveManagement.objects.filter(approved=True, user=user).count()
        employee = user
        average_feedback = Feedback.objects.filter(user=user).aggregate(Avg('feedback'))['feedback__avg']

        if average_feedback is None:
            average_feedback = 0

        return {
            'total_working_shifts': employee.current_shifts_count,
            'days_absent': leaves,
            'total_extra_shifts': employee.current_shifts_count - employee.no_of_shifts if employee.current_shifts_count > employee.no_of_shifts else 0,
            'total_salary': employee.salary / employee.no_of_shifts * employee.current_shifts_count,
            'feedback_avg': average_feedback
        }

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'start_date', 
                openapi.IN_QUERY, 
                description="Start date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            ),
            openapi.Parameter(
                'end_date', 
                openapi.IN_QUERY, 
                description="End date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=datetime.now().strftime('%Y-%m-%d')
            ),
        ]
    )
    def get(self, request):
        user = request.user
        end_date = request.query_params.get('end_date', datetime.now().date())
        start_date = request.query_params.get('start_date', (datetime.now() - timedelta(days=30)).date())
        if isinstance(end_date, str):
            end_date = make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
        if isinstance(start_date, str):
            start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        try:
            dashboard_data = self.get_dashboard_data(user, start_date, end_date)
            serialized_data = self.serializer_class(data=dashboard_data)
            if serialized_data.is_valid():
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            else:
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class DashboardGraphData(generics.GenericAPIView):
    serializer_class = DashBoardGraphSerializer

    def get_dashboard_data(self, user, start_date, end_date):
        emp_data_by_position = User.objects.filter(
            company=user.company, 
            is_manager=False,
        ).values('position').annotate(count=Count('id')).order_by('position')
        response_data = [
            {'position': item['position'], 'count': item['count']} for item in emp_data_by_position
        ]
        return response_data
    
    def get_dashboard_data2(self, user, start_date, end_date):
        emp_by_gender = User.objects.filter(
            company=user.company,
            is_manager=False,
        ).values('gender').annotate(count=Count('id')).order_by('gender')
        response_data = [
            {'gender': item['gender'], 'count': item['count']} for item in emp_by_gender
        ]
        return response_data

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'start_date', 
                openapi.IN_QUERY, 
                description="Start date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            ),
            openapi.Parameter(
                'end_date', 
                openapi.IN_QUERY, 
                description="End date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=datetime.now().strftime('%Y-%m-%d')
            ),
        ]
    )

    def get(self, request):
        user = request.user
        end_date = request.query_params.get('end_date', datetime.now().date())
        start_date = request.query_params.get('start_date', (datetime.now() - timedelta(days=30)).date())
        if isinstance(end_date, str):
            end_date = make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
        if isinstance(start_date, str):
            start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        try:
            dashboard_data = self.get_dashboard_data(user, start_date, end_date)
            dashboard_data2 = self.get_dashboard_data2(user, start_date, end_date)
            new_data = {
                'chart1': dashboard_data,
                'chart2': dashboard_data2,
            }
            serialized_data = self.serializer_class(data=new_data)
            if serialized_data.is_valid():
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            else:
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)