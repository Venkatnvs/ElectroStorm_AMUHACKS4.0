from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Company
from django.utils import timezone

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'first_name', 'last_name', 'phone_number', 'is_otp_verified', 'is_staff', 'is_completed', 'role']
    search_fields = ['email', 'first_name', 'last_name', 'role', 'phone_number']
    list_filter = ['is_active', 'is_staff', 'is_completed', 'is_otp_verified', 'is_socialaccount', 'role']

    def otp_created_at_date(self, obj):
        try:
            data = obj.otp_metadata.split(':')[0]
            return timezone.datetime.fromtimestamp(float(data))
        except IndexError:
            return None
        except ValueError:
            return None

    def otp_validations_attempts_left(self, obj):
        try:
            return 5 - int(obj.otp_metadata.split(':')[1])
        except IndexError:
            return None
        except ValueError:
            return None

    def otp_resend_attempts_left(self, obj):
        try:
            return 5 - int(obj.otp_metadata.split(':')[2])
        except IndexError:
            return None
        except ValueError:
            return None

    fieldsets = (
        (None, {'fields': ('email', 'password', 'phone_number')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'company', 'is_manager', 'gender', 'department', 'position')}),
        ('Salary info', {'fields': ('salary', 'no_of_shifts', 'current_shifts_count')}),
        ('OTP info', {'fields': ('otp', 'otp_metadata', 'is_otp_verified')}),
        ('OTP Metadata details', {'classes': ('collapse',), 'fields': ('otp_created_at_date', 'otp_validations_attempts_left', 'otp_resend_attempts_left')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_completed','is_socialaccount','groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password'),
        }),
    )

    readonly_fields = ('otp_created_at_date', 'otp_validations_attempts_left', 'otp_resend_attempts_left', 'last_login', 'date_joined')

    ordering = ['email']

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Company)