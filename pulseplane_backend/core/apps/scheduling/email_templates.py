scheduling_template = """
Hello {full_name},

Your work schedule for {date} is as follows:
Shift Type: {shift_type}
Start Time: {start_time}
End Time: {end_time}
Priority: {priority}

Regards,
{site_name}
"""

delete_scheduling_template = """
Hello {full_name},

Your work schedule for {date} has been cancelled.
Shift Type: {shift_type}
Start Time: {start_time}
End Time: {end_time}

Regards,
{site_name}
"""