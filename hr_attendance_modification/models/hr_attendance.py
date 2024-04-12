# -*- coding: utf-8 -*-
from odoo import models, fields, api, _


class HrAttendance(models.Model):
    _inherit = 'hr.attendance'

    project_id = fields.Many2one('project.project', string='Project')
    task_id = fields.Many2one('project.task', string='Task', domain="[('project_id','=',project_id)]")
    checkin_description = fields.Text(string='Description')