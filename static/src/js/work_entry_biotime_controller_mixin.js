odoo.define('hr_biotime_attendance_work_entry.WorkEntryBiotimeControllerMixin', function (require) {
    'use strict';

    var core = require('web.core');
    var time = require('web.time');

    var _t = core._t;
    var QWeb = core.qweb;

    var WorkEntryBiotimeControllerMixin = {
        /**
         * @override
         */
        updateButtons: function() {
            this._super.apply(this, arguments);

            if(!this.$buttons) {
                return;
            }

            this.$buttons.find('.btn-sync-work-entries-biotime').on('click', this._onSyncWorkEntriesBiotime.bind(this));
        },

        renderButtons: function($node) {
            this._super.apply(this, arguments);

            if(this.$buttons) {
                this.$buttons.append(this._renderWorkEntryButtons());
            }
        },

        /*
            Private
        */
       _renderWorkEntryButtons: function() {
            return $('<span>').append(QWeb.render('hr_work_entry.work_entry_button', {
                button_text: _t("Sync"),
                event_class: 'btn-sync-work-entries-biotime',
            }));
        },

        _syncWorkEntriesBiotime: function () {
            var self = this
            this.do_action('hr_biotime_attendance_work_entry.action_sync_wrk_entries_biotime', {
                additional_context: {
                    date_start: time.date_to_str(this.firstDay),
                    date_end: time.date_to_str(this.lastDay),
                },
            }).then(function(){
                self.reload()
                self.displayNotification({
                    title: _t("Succès"),
                    message: _t("Synchronisation réussite !")
                })
            });
        },
        
        _onSyncWorkEntriesBiotime: function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this._syncWorkEntriesBiotime();
        },

    }

    return WorkEntryBiotimeControllerMixin;

})