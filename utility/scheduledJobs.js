const schedule = require('node-schedule');

const {getAllProjectsDueTomorrow} = require('../services/project.service');
const {getAllTasksDueTomorrow} = require('../services/task.service');

exports.runJob = schedule.scheduleJob({hour: 22, minute: 0}, function(){
    getAllProjectsDueTomorrow();
    getAllTasksDueTomorrow()
});
