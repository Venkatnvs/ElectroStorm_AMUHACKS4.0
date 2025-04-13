from rest_framework import serializers
from .models import LeaveManagement, Feedback
from core.serializers import EmployeeSerializer

class LeaveManagementSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = LeaveManagement
        fields = '__all__'

class LeaveManagementDetailSerializer(serializers.ModelSerializer):
    user = EmployeeSerializer()

    class Meta:
        model = LeaveManagement
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'