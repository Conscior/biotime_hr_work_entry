import pytz

from odoo import api, fields, models
from odoo import _


class HrAttendance(models.Model):
    _inherit = 'hr.attendance'

    def validate_attendance(self):
        for rec in self:
            rec.state = 'validated'
    
    def confirm_overtime(self):
        for rec in self:
            rec.state = 'validated'
            # Create overtime

    state = fields.Selection([
        ('draft', 'Brouillon'),
        ('validated', 'value'),
    ], string='Status')