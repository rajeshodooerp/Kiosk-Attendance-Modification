# -*- coding: utf-8 -*-
from odoo.addons.hr_attendance.controllers.main import HrAttendance
from odoo import http, _
from odoo.http import request


class HrAttendanceKiosk(HrAttendance):

    # Inherited this method to pass projects and tasks to Kiosk Screen.
    @http.route(["/hr_attendance/<token>"], type='http', auth='public', website=True, sitemap=True)
    def open_kiosk_mode(self, token):
        res = super(HrAttendanceKiosk, self).open_kiosk_mode(token)
        if res.qcontext.get('kiosk_backend_info'):
            project_data = request.env['project.project'].sudo().search_read([], ['id', 'name'])
            task_data = request.env['project.task'].sudo().search_read([], ['id', 'name', 'project_id'])
            res.qcontext.get('kiosk_backend_info').update({
                'projects': project_data,
                'tasks': task_data
            })
        return res

    # Added this method to check the employee last attendance activity, whether user was checked in/out previously.
    @http.route('/hr_attendance/is_employee_checking_in', type="json", auth="public")
    def get_employee_checking_in(self, token, employee_id, pin_code, barcode):
        company = self._get_company(token)
        if company:
            if barcode:
                employee = request.env['hr.employee'].sudo().search(
                    [('barcode', '=', barcode), ('company_id', '=', company.id)], limit=1)
                if employee.company_id == company:
                    return {'check_in': True, 'employeeId': employee.id} if employee.attendance_state != 'checked_in' else {'check_out': True}
            else:
                employee = request.env['hr.employee'].sudo().browse(employee_id)
                if employee.company_id == company and (
                        (not company.attendance_kiosk_use_pin) or (employee.pin == pin_code)):
                    return {'check_in': True, 'employeeId': employee.id} if employee.attendance_state != 'checked_in' else {'check_out': True}
        return False

    # Added this method to pass project, task and description while creating attendance.
    @http.route('/hr_attendance/project_checkin', type="json", auth="public")
    def project_selection(self, token, employee_id, project_data):
        company = self._get_company(token)
        if company:
            employee = request.env['hr.employee'].sudo().browse(employee_id)
            attendance_id = employee.sudo()._attendance_action_change(self._get_geoip_response('kiosk'))
            attendance_id.write(project_data)
            return self._get_employee_info_response(employee)
        return {}