odoo.define('hr_biotime_attendance_work_entry.hr_work_entry', function (require){
    "use strict";

    var core = require('web.core');
    var time = require('web.time');

    var _t = core._t;
    var QWeb = core.qweb;

    var WorkEntryGanttController = require("hr_work_entry_contract.work_entries_gantt");

    WorkEntryGanttController.include({

        // Call the action_sync_wrk_entries_biotime action with a context (Start date and end date of current month)
        _sync_work_entries_biotime: function(){
            var self = this
            self.do_action('hr_biotime_attendance_work_entry.action_sync_wrk_entries_biotime', {
                additional_context: {
                    default_date_start: time.date_to_str(this.firstDay),
                    default_date_end: time.date_to_str(this.lastDay),
                },
            }).then(function(){
                self.reload()
                self.do_notify(_t("Succès"), _t("Synchronisation réussite !"))
            });
        },
        
        // Add sync button next to Generate payslip button
        _renderWorkEntryButtons: function () {
            if (this.modelName !== "hr.work.entry") {
                return;
            }

            var records = this._fetchRecords();
            var hasConflicts = records.some(function (record) { return record.state === 'conflict'; });
            var allValidated = records.every(function (record) { return record.state === 'validated'; });

            this.$buttons.find('.btn-work-entry').remove();

            if (!allValidated && records.length !== 0) {
                this.$buttons.append(QWeb.render('hr_work_entry.work_entry_button', {
                    button_text: _t("Generate Payslips"),
                    event_class: 'btn-payslip-generate',
                    disabled: hasConflicts,
                }));
                this.$buttons.append(QWeb.render('hr_work_entry.work_entry_button', {
                    button_text: _t("Synchroniser"),
                    event_class: 'btn-work-entries-sync',
                }));
                this.$buttons.find('.btn-payslip-generate').on('click', this._onGeneratePayslips.bind(this));
                this.$buttons.find('.btn-work-entries-sync').on('click', this._sync_work_entries_biotime.bind(this));
            }
        },
    })
})