from datetime import timedelta
import pytz

from odoo import models, fields, api, _
from odoo.exceptions import UserError


class HrWorkEntry(models.Model):
    _inherit = 'hr.work.entry'

    def sync_wrk_entries_biotime(self):
        from_date = self.env.context.get('default_date_start', False)
        end_date = self.env.context.get('default_date_end', False)

        if from_date and end_date:
            from_date = fields.Datetime.to_datetime(from_date)
            end_date = fields.Datetime.to_datetime(end_date + ' 23:59:59')
            atts = self.env['hr.attendance'].search([])

            if atts.filtered(lambda rec: not rec.check_in or not rec.check_out):
                raise UserError(
                    "Veuillez remplir les fiches de présences correctement.")

            atts = atts.filtered(
                lambda rec: rec.check_in and rec.check_out and rec.check_in >= from_date and rec.check_out <= end_date)
        else:
            atts = self.env['hr.attendance'].search([])

        for att in atts:
            local_att_check_in = pytz.utc.localize(att.check_in, is_dst=None).astimezone(
                pytz.timezone(self.env.user.partner_id.tz or 'GMT'))
            local_att_check_out = pytz.utc.localize(att.check_out, is_dst=None).astimezone(
                pytz.timezone(self.env.user.partner_id.tz or 'GMT'))

            shift_line = att.employee_id.biotime_shift_id.biotime_shift_lines.filtered(
                lambda shift_line: int(shift_line.day_in) == local_att_check_in.weekday() and int(shift_line.day_out) == local_att_check_out.weekday())

            if shift_line and shift_line.ensure_one():
                margin_check_in = (shift_line.check_in_end -
                                   shift_line.check_in_start)
                margin_check_out = (shift_line.check_out_end -
                                    shift_line.check_out_start)

                eq_wrk_entry = self.env['hr.work.entry'].search([
                    ('employee_id', '=', att.employee_id.id),
                    ('date_start', '>=', att.check_in -
                     timedelta(hours=margin_check_in)),
                    ('date_stop', '<=', att.check_out +
                     timedelta(hours=margin_check_out)),
                    ('state', '=', 'draft')
                ])

                if eq_wrk_entry:
                    work_entry_type_id = self.env['hr.work.entry.type'].search(
                        [('code', '=', 'WORK100')])
                    eq_wrk_entry[0].write({
                        'name': str(work_entry_type_id.name) + ' : ' + str(att.employee_id.name),
                        'date_start': att.check_in,
                        'work_entry_type_id': work_entry_type_id.id,
                        'state': 'validated'
                    })
                    eq_wrk_entry[-1].write({
                        'name': str(work_entry_type_id.name) + ' : ' + str(att.employee_id.name),
                        'work_entry_type_id': work_entry_type_id.id,
                        # Allow user to aproove overtimes
                        'date_end': att.check_out if not att.overtime else eq_wrk_entry[-1].date_end,
                        'state': 'validated'
                    })
