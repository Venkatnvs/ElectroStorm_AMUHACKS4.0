from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.utils import extract_first_last_name
from django.contrib.auth.password_validation import validate_password
from accounts.models import UserRoles
from core.email_templates import employee_add_template
from django.conf import settings
from core.utils import EmailThread

User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'password', 'phone_number', 'department', 'position', 'gender', 'salary', 'no_of_shifts', 'current_shifts_count']

    def create(self, validated_data):
        first_name, last_name = extract_first_last_name(validated_data['full_name'])
        request_user = self.context['request'].user
        company = request_user.company if request_user.role == UserRoles.ADMIN else None
        employee = User.objects.create_user(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            gender=validated_data['gender'],
            department=validated_data['department'],
            position=validated_data['position'],
            first_name=first_name,
            last_name=last_name,
            password=validated_data['password'],
            is_completed=True,
            is_active=True,
            is_otp_verified=True,
            role=UserRoles.STAFF,
            company=company,
            is_manager=False,
            salary=validated_data['salary'],
            no_of_shifts=validated_data['no_of_shifts']
        )
        self.send_email_to_user(employee)
        return employee
    
    def send_email_to_user(self, user):
        subject = f'Welcome to {settings.SITE_NAME}'
        message = employee_add_template.format(
            full_name=user.full_name,
            company_name=user.company.name if user.company else 'BitNBuild',
            email = user.email,
            salary = user.salary,
            password = self.validated_data['password'],
            site_name=settings.SITE_NAME
        )
        recipient_list = [user.email]
        email_thread = EmailThread(subject, message, recipient_list)
        email_thread.start()

class DashBoardSerializer(serializers.Serializer):
    number_of_employees = serializers.IntegerField()
    number_of_present_employees = serializers.IntegerField()
    number_of_absent_employees = serializers.IntegerField()
    new_hiring_applications = serializers.IntegerField()
    total_salary = serializers.IntegerField()
    total_payroll = serializers.IntegerField()

class DashBoardSerializer2(serializers.Serializer):
    total_working_shifts = serializers.IntegerField()
    days_absent = serializers.IntegerField()
    total_extra_shifts = serializers.IntegerField()
    total_salary = serializers.IntegerField()
    feedback_avg = serializers.FloatField()

class PositionBasedSerializer(serializers.Serializer):
    position = serializers.CharField()
    count = serializers.IntegerField()

class GenderBasedSerializer(serializers.Serializer):
    gender = serializers.CharField()
    count = serializers.IntegerField()

class DashBoardGraphSerializer(serializers.Serializer):
    chart1 = PositionBasedSerializer(many=True)
    chart2 = GenderBasedSerializer(many=True)