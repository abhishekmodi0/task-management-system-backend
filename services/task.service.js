
const db = require("../utility/dbConnection");
const dbConstants  = require('../constants/databaseConstants');
const { sendNotificationEmail, mailOptions } = require("../utility/notificationMailer");
const { commonEmailTemplate } = require("../templates/common.email.template");

const { isAdmin, getUserId } = require('../utility/authorization')

exports.createTask = (req, callback) => {
    const {body : request} = req;
    db.query(dbConstants.createTask, 
        [request.assignedTo, request.title, request.description, request.dueDate, request.status, request.priority, request.tagName, request.projectId, getUserId(req), getUserId(req)], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else {
                createAndUpdateTaskNotification(result.insertId, (e, res) => {
                    if (e) callback(e, res)
                    else callback(null, result)
                })
            }
    })
}

exports.editTask = (req, callback) => {
    let query = isAdmin(req) ? dbConstants.updateTaskByAdmin : dbConstants.updateTaskByUser;
    let params = isAdmin(req) ? [req.body.assignedTo, req.body.title, req.body.description, req.body.dueDate, req.body.status, req.body.priority, req.body.tagName, req.params.id] : [req.body.assignedTo, req.body.title, req.body.description,  req.body.status, req.params.id];
    db.query(query, params, (error, result) => {
            if(error){
                callback(error, null)
            } else {
                createAndUpdateTaskNotification(req.params.id, (e, res) => {
                    if (e) callback(e, res)
                    else callback(null, result)
                })
            }
    })
}

exports.deleteTask = (req, callback) => {
    db.query(dbConstants.deleteTask, 
        [req.id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.getAllTasks = (req, callback) => {
    let query = isAdmin(req) ? dbConstants.getAllTasksForAdmin : dbConstants.getAllTasksForUser;
    let params = isAdmin(req) ? [req.params.projectId] : [req.params.projectId, getUserId(req)];
    db.query(query, params, (error, result) => {
        if(error){
            callback(error, null)
        } else callback(null, result)
    })
}

exports.getTaskById = (req, callback) => {
    db.query(dbConstants.getTaskById, [req.params.id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.getFormFields = (callback) => {
    db.query(dbConstants.getPriorityLevels + dbConstants.getAllStatuses + dbConstants.getAllTagName, (error, result) => {
        if(error){
            callback(error, null)
        } else {
            const response = {};
            response.priorityLevels = result[0];
            response.statuses = result[1];
            response.tagName = result[2];
            callback(null, response)
        }
    })
}

exports.getAllTasksDueTomorrow = (callback) => {
    db.query(dbConstants.getUserTasksDueDateIsTomorrow, 1, (error, result) => {
            if(error){
                callback(error, null)
            } else if(result.length > 0){
                result.forEach(record => {
                    if(record.selfOwner === 1){
                        let message = `Hello ${record.fullName}, Task - ${record.title} of Project - ${record.projectTitle} that you are assigned of is due on ${record.dueDate}, Please move it to complete status to avoid last moment glitch.`; 
                        mailOptions.subject = `Task Due Date`;
                        mailOptions.to =  record.email;
                        mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
                        sendNotificationEmail(mailOptions, (info) => {
                            console.log("Emai has been sent, MESSAGE ID: ", info.messageId);
                        })
                    } else {
                        let message = `Hello ${record.OwnerFullName}, Task - ${record.title} of Project - ${record.projectTitle} that you created and assigned to ${record.fullName}  is due on ${record.dueDate}, Please move it to complete status to avoid last moment glitch.`; 
                        mailOptions.subject = `Task Due Date`;
                        mailOptions.to =  record.OwnerEmail;
                        mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
                        sendNotificationEmail(mailOptions, (info) => {
                            console.log("Emai has been sent, MESSAGE ID: ", info.messageId);
                            let message = `Hello ${record.fullName}, Task - ${record.title} of Project - ${record.projectTitle} that you are assigned of is due on ${record.dueDate}, Please move it to complete status to avoid last moment glitch.`; 
                            mailOptions.subject = `Task Due Date`;
                            mailOptions.to =  record.email;
                            mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
                            sendNotificationEmail(mailOptions, (i) => {
                                console.log("Emai has been sent, MESSAGE ID: ", i.messageId);
                            })
                        })
                    }
                });
            }
    })
}

function createAndUpdateTaskNotification(id, callback){
    db.query(dbConstants.getTaskDetails, id, async (err, result) => {
        if(err) { 
            callback(err, null)
        } else {
            const [record] = result
            let message = `Hello ${record.fullName}, Task - ${record.title} of Project - ${record.projectTitle} has been assigned to you with due on ${record.dueDate}, priority level - ${record.priorityLevel} and tag name - ${record.tagName}, please move task status according to its state.`; 
            mailOptions.subject = `Task Assignment`;
            mailOptions.to =  record.email;
            mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
            await sendNotificationEmail(mailOptions, (info) => {
                console.log("Emai has been sent, MESSAGE ID: ", info.messageId);
            })
            callback(err, result)
        }
    })
}
