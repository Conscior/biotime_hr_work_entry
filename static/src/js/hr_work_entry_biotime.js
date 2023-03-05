odoo.define('hr_biotime_attendance_work_entry.hr_work_entry_biotime', function(require) {
    'use strict';

    // var core = require('web.core');
    // var time = require('web.time');

    // var _t = core._t;
    // var QWeb = core.qweb;

    var WorkEntryBiotimeControllerMixin = require('hr_biotime_attendance_work_entry.WorkEntryBiotimeControllerMixin');
    var WorkEntryGanttController = require("hr_work_entry_contract_enterprise.work_entries_gantt");

    var WorkEntryBiotimeController = WorkEntryGanttController.include(WorkEntryBiotimeControllerMixin);
    
    return WorkEntryBiotimeController;

    // const WorkEntryControllerMixin = require('hr_work_entry_contract.WorkEntryControllerMixin');

    // WorkEntryControllerMixin.include({
    //     _renderBiotimeSyncButton: function() {
    //         return $('<span>').append(QWeb.render('hr_work_entry.work_entry_button', {
    //             button_text: _t("Sync Biotime"),
    //             event_class: 'btn-work-entries-biotime-sync',
    //         }));
    //     },
    // })
});