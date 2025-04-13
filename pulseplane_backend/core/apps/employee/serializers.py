from rest_framework import serializers
from .models import LeaveManagement, Feedback, WellnessCheck, RecognitionBadge, RecognitionAward
from core.serializers import EmployeeSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

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

class WellnessCheckSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = WellnessCheck
        fields = ['id', 'user', 'user_name', 'date', 'mood', 'stress_level', 
                  'sleep_hours', 'work_life_balance', 'notes']
        read_only_fields = ['user', 'date']
    
    def get_user_name(self, obj):
        return obj.user.full_name if obj.user else None
    
    def validate(self, data):
        # Ensure values are within acceptable ranges
        if data.get('mood') not in [choice[0] for choice in WellnessCheck.MOOD_CHOICES]:
            raise serializers.ValidationError({"mood": "Invalid mood value"})
        
        if data.get('stress_level') not in [choice[0] for choice in WellnessCheck.STRESS_LEVEL_CHOICES]:
            raise serializers.ValidationError({"stress_level": "Invalid stress level value"})
        
        if data.get('work_life_balance') not in [choice[0] for choice in WellnessCheck.MOOD_CHOICES]:
            raise serializers.ValidationError({"work_life_balance": "Invalid work-life balance value"})
        
        if data.get('sleep_hours') and (data['sleep_hours'] < 0 or data['sleep_hours'] > 24):
            raise serializers.ValidationError({"sleep_hours": "Sleep hours must be between 0 and 24"})
        
        return data

class RecognitionBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecognitionBadge
        fields = ['id', 'name', 'description', 'icon', 'points']

class RecognitionAwardSerializer(serializers.ModelSerializer):
    recipient_name = serializers.SerializerMethodField()
    giver_name = serializers.SerializerMethodField()
    badge_details = RecognitionBadgeSerializer(source='badge', read_only=True)
    
    class Meta:
        model = RecognitionAward
        fields = ['id', 'recipient', 'recipient_name', 'giver', 'giver_name', 
                  'badge', 'badge_details', 'message', 'created_at', 'public']
        read_only_fields = ['giver', 'created_at']
    
    def get_recipient_name(self, obj):
        return obj.recipient.full_name
    
    def get_giver_name(self, obj):
        return obj.giver.full_name
    
    def validate(self, data):
        # Ensure user isn't recognizing themselves
        request = self.context.get('request')
        if request and data.get('recipient') == request.user:
            raise serializers.ValidationError({"recipient": "You cannot recognize yourself"})
        
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['giver'] = request.user
        return super().create(validated_data)