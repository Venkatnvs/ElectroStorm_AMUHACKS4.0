from rest_framework import serializers
from .models import Scheduling
from core.serializers import EmployeeSerializer
class SchedulingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scheduling
        fields = '__all__'

class SchedulingDetailedSerializer(serializers.ModelSerializer):
    user = EmployeeSerializer(many=True)
    class Meta:
        model = Scheduling
        fields = '__all__'
