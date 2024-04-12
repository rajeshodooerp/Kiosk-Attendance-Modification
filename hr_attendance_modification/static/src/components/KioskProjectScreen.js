/** @odoo-module **/

import { Component, onWillStart, useState, onWillDestroy } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";


export class KioskProjectScreen extends Component {
    setup() {
        this.state = useState({
            tasks: [],
            project: false,
            task: false,
            description: false,
        });
    }

    onprojectChange(ev){
        var project = ev.target.value
        if(project){
            this.state.tasks = this.props.tasks.filter((r) => r.project_id && r.project_id[0] == parseInt(project))
            this.state.project = project
        }else{
            this.state.project = false
        }
    }

    ontaskChange(ev){
        var task = ev.target.value
        if(task){
            this.state.task = task
        }else{
            this.state.task = false
        }
    }
    onDescriptionChange(ev){
        var description = ev.target.value
        if(description && description.length > 0){
            this.state.description = description
        }else{
            this.state.description = false
        }
    }
    onClickProceed(){
        this.props.onProjectScreenDone(this.state.project, this.state.task, this.state.description)
    }
}

KioskProjectScreen.props = {
    projects : {type: Object},
    tasks : {type: Object},
    onClickBack: {type: Function},
    onProjectScreenDone: {type: Function}
}

KioskProjectScreen.template = "hr_attendance_modification.KioskProjectScreen";