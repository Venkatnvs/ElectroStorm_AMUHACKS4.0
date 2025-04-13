from rest_framework import serializers
from .models import LeaveManagement, Feedback, PeerRecognition
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

class PeerRecognitionCreateSerializer(serializers.ModelSerializer):
    sender = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = PeerRecognition
        fields = ['sender', 'recipient', 'recognition_type', 'message', 'is_public']
        
class PeerRecognitionDetailSerializer(serializers.ModelSerializer):
    sender = EmployeeSerializer(read_only=True)
    recipient = EmployeeSerializer(read_only=True)
    recognition_type_display = serializers.CharField(source='get_recognition_type_display', read_only=True)
    
    class Meta:
        model = PeerRecognition
        fields = ['id', 'sender', 'recipient', 'recognition_type', 'recognition_type_display', 
                  'message', 'is_public', 'created_at']