# -*- coding: utf-8 -*-
{
    "name": "HR Attendance Check In/Out Modification",
    "summary": "HR Attendance Check In/Out Modification",
    "version": "17.0.0.0.1",
    "category": "Human Resources/Attendances",
    "depends": ["project", "hr_attendance"],
    "data": [
        'views/hr_attendance_views.xml',
        'views/hr_attendance_kiosk_templates.xml',
    ],
    "assets": {
        'web.assets_backend': [
            'hr_attendance_modification/static/src/**/*',
        ],
        'hr_attendance.assets_public_attendance': [
            "hr_attendance_modification/static/src/public_kiosk/**/*",
            'hr_attendance_modification/static/src/components/**/*',
        ],
    },
    "installable": True,
    'application': False,
}
