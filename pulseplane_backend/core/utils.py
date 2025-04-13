from django.core.mail import send_mail
import threading
from django.conf import settings

class EmailThread(threading.Thread):
    def __init__(self, subject, message, recipient_list):
        self.subject = subject
        self.message = message
        self.recipient_list = recipient_list
        super().__init__()

    def run(self):
        send_mail(self.subject, self.message, settings.DEFAULT_FROM_EMAIL, self.recipient_list)