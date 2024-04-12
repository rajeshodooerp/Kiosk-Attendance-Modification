/** @odoo-module **/
import {App, whenReady, Component, onMounted, onWillStart, useState} from "@odoo/owl";
import { makeEnv, startServices } from "@web/env";
import { _t } from "@web/core/l10n/translation";
import { templates } from "@web/core/assets";
import publicKiosk from '@hr_attendance/public_kiosk/public_kiosk_app';
import {KioskProjectScreen} from '@hr_attendance_modification/components/KioskProjectScreen';
import { patch } from "@web/core/utils/patch";

console.log("=========", KioskProjectScreen)

publicKiosk.kioskAttendanceApp.components =  Object.assign(publicKiosk.kioskAttendanceApp.components, {'KioskProjectScreen': KioskProjectScreen});

patch(publicKiosk.kioskAttendanceApp.prototype, {
    setup() {
        super.setup();
    },

    switchDisplay(screen) {
        if(screen == 'project'){
            this.state.active_display = 'project';
        }else{
            super.switchDisplay(...arguments);
        }
    },

    async checkEmployeeAttendanceStatus(employeeId, enteredPin, barcode){
        console.log("Values==", employeeId, enteredPin, barcode)
        const result = await this.rpc('is_employee_checking_in',{
            'token': this.props.token,
            'employee_id': employeeId,
            'pin_code': enteredPin,
            'barcode': barcode,
        })
        if(result && result.check_in){
            console.log("Result========", result)
            this.employee_id = result.employeeId
            return true;
        }
    },

    async onManualSelection(employeeId, enteredPin){
        const result = await this.checkEmployeeAttendanceStatus(employeeId,enteredPin,false);
        if(result){
            this.switchDisplay('project');
        }else{
            super.onManualSelection(...arguments);
        }
    },

    async onBarcodeScanned(barcode){
        const result = await this.checkEmployeeAttendanceStatus(false,false,barcode);
        if(result){
            this.switchDisplay('project');
        }else{
            super.onBarcodeScanned(...arguments);
        }
    },

    async onProjectScreenDone(project, task, description){
        const result = await this.rpc('project_checkin',
            {
                'token': this.props.token,
                'employee_id': this.employee_id,
                'project_data':{
                    'project_id': parseInt(project),
                    'task_id': parseInt(task),
                    'checkin_description': description,
                },
            })
        if (result && result.attendance) {
            this.employeeData = result
            this.switchDisplay('greet')
            this.employee_id = false;
        }else{
            this.displayNotification(_t("Error while checking in!"))
            this.employee_id = false;
            this.pin = false;
        }
    }
});

export async function createPublicKioskAttendanceKiosk(document, kiosk_backend_info) {
    await whenReady();
    const env = makeEnv();
    await startServices(env);
    const app = new App(publicKiosk.kioskAttendanceApp, {
        templates,
        env: env,
        props:
            {
                token : kiosk_backend_info.token,
                companyId: kiosk_backend_info.company_id,
                companyName: kiosk_backend_info.company_name,
                employees: kiosk_backend_info.employees,
                projects: kiosk_backend_info.projects,
                tasks: kiosk_backend_info.tasks,
                departments: kiosk_backend_info.departments,
                kioskMode: kiosk_backend_info.kiosk_mode,
                barcodeSource: kiosk_backend_info.barcode_source,
            },
        dev: env.debug,
        translateFn: _t,
        translatableAttributes: ["data-tooltip"],
    });
    return app.mount(document.body);
}

export default { createPublicKioskAttendanceKiosk };