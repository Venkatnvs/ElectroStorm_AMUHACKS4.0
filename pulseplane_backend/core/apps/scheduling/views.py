from rest_framework import generics, status
from .models import Scheduling
from .serializers import SchedulingSerializer, SchedulingDetailedSerializer
from .email_templates import scheduling_template, delete_scheduling_template
from django.conf import settings
from core.utils import EmailThread
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()

class SchedulingListCreateView(generics.ListCreateAPIView):
    queryset = Scheduling.objects.all()
    serializer_class = SchedulingSerializer

    def perform_create(self, serializer):
        scheduling = serializer.save()
        users = scheduling.user.all()
        for user in users:
            self.send_email_to_user(user, scheduling)

    def send_email_to_user(self, user, scheduling):
        subject = f'Scheduled Shift: {scheduling.shift_type} on {scheduling.date}'
        message = scheduling_template.format(
            full_name=user.full_name,
            shift_type=scheduling.shift_type,
            date=scheduling.date,
            start_time=scheduling.start_time,
            end_time=scheduling.end_time,
            priority=scheduling.priority,
            site_name=settings.SITE_NAME
        )
        recipient_list = [user.email]
        email_thread = EmailThread(subject, message, recipient_list)
        email_thread.start()

class SchedulingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scheduling.objects.all()
    serializer_class = SchedulingSerializer

class SchedulingDetailedListCreateView(generics.ListCreateAPIView):
    queryset = Scheduling.objects.all()
    serializer_class = SchedulingDetailedSerializer

class SchedulingDetailedRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scheduling.objects.all()
    serializer_class = SchedulingDetailedSerializer

class SchedulingUserDeleteView(generics.DestroyAPIView):
    queryset = Scheduling.objects.all()
    serializer_class = SchedulingSerializer

    def delete(self, request, *args, **kwargs):
        scheduling_id = kwargs.get('pk')
        user_id = request.data.get('user_id')

        try:
            scheduling = Scheduling.objects.get(id=scheduling_id)
            user = User.objects.get(id=user_id)
            scheduling.user.remove(user)
            self.send_delete_email(user, scheduling)
            if scheduling.user.count() == 0:
                scheduling.delete()
                return Response(
                    {"message": "User deleted and scheduling removed as it had no other users.", "type":"sc"}, 
                    status=status.HTTP_204_NO_CONTENT
                )
            return Response({"message": "User removed from scheduling."}, status=status.HTTP_200_OK)
        except Scheduling.DoesNotExist:
            return Response({"error": "Scheduling not found."}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def send_delete_email(self, user, scheduling):
        subject = f'Scheduling Update: Removed from Shift on {scheduling.date}'
        message = delete_scheduling_template.format(
            full_name=user.full_name,
            shift_type=scheduling.shift_type,
            date=scheduling.date,
            start_time=scheduling.start_time,
            end_time=scheduling.end_time,
            site_name=settings.SITE_NAME
        )
        recipient_list = [user.email]
        email_thread = EmailThread(subject, message, recipient_list)
        email_thread.start()

class SchedulingDetailedListCreateView2(generics.ListCreateAPIView):
    serializer_class = SchedulingDetailedSerializer

    def get_queryset(self):
        user = self.request.user
        return Scheduling.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=[self.request.user])
