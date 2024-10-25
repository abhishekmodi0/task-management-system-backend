
const db = require("../utility/dbConnection");
const dbConstants  = require('../constants/databaseConstants');
const { isAdmin, getUserId } = require('../utility/authorization');
const {sendNotificationEmail, mailOptions} = require("../utility/notificationMailer");
const {commonEmailTemplate} = require("../templates/common.email.template");

exports.createProject = (req, callback) => {
    db.query(dbConstants.createProject, 
        [req.title, req.description, req.completionDate, req.user[0].id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.editProject = (req, callback) => {
    db.query(dbConstants.updateProject, 
        [req.body.title, req.body.description, req.body.completionDate, req.body.user[0].id, req.params.id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.deleteProject = (req, callback) => {
    db.query(dbConstants.deleteProject, 
        [req.id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.getAllProjects = (req, callback) => {
    let query = isAdmin(req) ? dbConstants.getAllProjects : dbConstants.getAllProjectsForUser;
    db.query(query, [getUserId(req)], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.getProjectById = (req, callback) => {
    db.query(dbConstants.getProjectById, 
        [req.id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.assignMultipleUsersToProject = (req, callback) => {
    db.query(dbConstants.addProjectUsers, 
        req, 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.removeProjectAccessFromUsers = (req, callback) => {
    db.query(dbConstants.removeProjectUsers, [req.body.recordsToBeDeleted, req.params.id], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else {
                module.exports.sendProjectNotificationToUser(req.body.recordsToBeDeleted, req.body, (e, res ) => {
                    if(e) callback(e, null) 
                    else callback(null, result)
                })
                
            }
    })
}

exports.getAllProjectsDueTomorrow = () => {
    db.query(dbConstants.getAllProjectsDueDateIsTomorrow, 1, 
        (error, result) => {
            if(error){
                callback(error, null)
            } else if(result.length > 0){
                result.forEach(record => {
                    let message = `Hello ${record.userName}, Project - ${record.title} that you are part of is due on ${record.completionDate}, please close all your tasks to avoid last moment glitch.`; 
                    mailOptions.subject = `Project Completion Date`;
                    mailOptions.to =  record.email;
                    mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
                    sendNotificationEmail(mailOptions, (info) => {
                        console.log("Emai has been sent, MESSAGE ID: ", info.messageId);
                    })
                });
            }
    })
}

exports.sendProjectNotificationToUser = (users, projectDetail, callback) => {
    db.query(dbConstants.getMultipleUsers, users, async (error, result) => {
            if(error){
                callback(error, null)
            } else if(result.length > 0){
                await result.forEach(record => {
                    let message;
                    if(projectDetail.create){
                        message = `Hello ${record.fullName}, You have been assigned to a Project - ${projectDetail.title}, you can create new task as per your requirement.`; 
                        mailOptions.subject = `New Project Assignment`;
                    } else if(projectDetail.recordsToBeDeleted.length > 0){
                        message = `Hello ${record.fullName}, You have been unassigned from a Project - ${projectDetail.title}.`; 
                        mailOptions.subject = `Project Unassignment`;
                    } else if(!projectDetail.create){
                        message = `Hello ${record.fullName}, You have been assigned to a Project - ${projectDetail.title}, you can create new task as per your requirement.`; 
                        mailOptions.subject = `Update Project Assignment`;
                    }
                    mailOptions.to =  record.email;
                    mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
                    sendNotificationEmail(mailOptions, (info) => {
                        console.log("Emai has been sent, MESSAGE ID: ", info.messageId);
                    })
                });
                callback(error, result)
            } else callback(error, result)
    })
}
