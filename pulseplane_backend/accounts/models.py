from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import random
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import RegexValidator

class UserRoles(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    STAFF = 'staff', 'Staff'

class GenderChoices(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    OTHER = 'other', 'Other'

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_completed', True)
        extra_fields.setdefault('role', UserRoles.ADMIN)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True, help_text='Email address')
    is_completed = models.BooleanField(default=False, help_text='User profile is completed')
    is_socialaccount = models.BooleanField(default=False, help_text='User is registered via social account')
    role = models.CharField(max_length=20, choices=UserRoles.choices, default=UserRoles.STAFF, help_text='User role')
    phone_number = models.CharField(max_length=15, blank=True, null=True, help_text='Phone number', unique=True, validators=[RegexValidator(r'^\+?\d{9,15}$')])

    # OTP fields
    otp = models.CharField(max_length=128, blank=True, null=True, help_text='Hashed OTP')
    otp_metadata = models.CharField(max_length=50, blank=True, null=True, help_text='created_at:validations_attempts:resend_attempts')
    is_otp_verified = models.BooleanField(default=False, help_text='OTP is verified')

    # Company
    company = models.ForeignKey('Company', on_delete=models.SET_NULL, blank=True, null=True, help_text='Company')
    is_manager = models.BooleanField(default=False, help_text='User is a manager')

    department = models.CharField(max_length=100, null=True, blank=True)
    position = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GenderChoices.choices, null=True, blank=True)

    salary = models.IntegerField(null=True, blank=True)
    no_of_shifts = models.IntegerField(null=True, blank=True)

    current_shifts_count = models.IntegerField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def generate_otp(self):
        otp_raw = str(random.randint(100000, 999999))
        self.otp = make_password(otp_raw)
        # OTP metadata => created_at:attempts:resend_attempts
        self.otp_metadata = f'{timezone.now().timestamp()}:0:0'
        self.save()
        return otp_raw
    
    def is_otp_valid(self, otp):
        if not self.otp or not self.otp_metadata:
            return False

        created_at, attempts, resend_attempts = self.otp_metadata.split(':')
        created_at = float(created_at)
        attempts = int(attempts)
        resend_attempts = int(resend_attempts)

        # Lockout logic: max 5 attempts or 10 minutes expiration
        if attempts >= 5 or timezone.now().timestamp() > created_at + 600:
            return False
        
        if self.is_otp_verified:
            return True

        if check_password(otp, self.otp):
            # Clear OTP fields upon successful verification
            self.otp = None
            self.otp_metadata = None
            self.save()
            return True
        else:
            # Increment failed attempts
            self.otp_metadata = f'{created_at}:{attempts + 1}:{resend_attempts}'
            self.save()
            return False

    def can_resend_otp(self):
        if not self.otp_metadata:
            return True
        if self.is_otp_verified:
            return False
        created_at, _, resend_attempts = self.otp_metadata.split(':')
        created_at = float(created_at)
        resend_attempts = int(resend_attempts)

        if resend_attempts >= 5:
            if timezone.now().timestamp() > created_at + 1800:
                # Clear OTP fields upon expiration
                self.otp = None
                self.otp_metadata = None
                self.save()
                return True
            return False
        # Allow resending OTP only after 60 seconds
        return timezone.now().timestamp() > created_at + 60
    
    def add_resend_attempt(self):
        if not self.otp_metadata:
            return False

        created_at, attempts, resend_attempts = self.otp_metadata.split(':')
        resend_attempts = int(resend_attempts)
        self.otp_metadata = f'{created_at}:{attempts}:{resend_attempts + 1}'
        self.save()
        return True

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    @property
    def company_name(self):
        return self.company.name if self.company else None
    
    @property
    def company_address(self):
        return self.company.address if self.company else None
    
    @property
    def branch_name(self):
        return self.company.branch_name if self.company else None

class Company(models.Model):
    name = models.CharField(max_length=100, help_text='Company name', unique=True)
    address = models.CharField(max_length=100, help_text='Company address', null=True, blank=True)
    branch_name = models.CharField(max_length=100, help_text='Branch name', null=True, blank=True)

    def __str__(self):
        return self.name