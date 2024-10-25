const db = require("../utility/dbConnection");
const dbConstants  = require('../constants/databaseConstants');
const {sendNotificationEmail, mailOptions} = require("../utility/notificationMailer");
const {commonEmailTemplate} = require("../templates/common.email.template");
const { isAdmin, getUserId } = require("../utility/authorization");

exports.checkIfEmailExists = (email, callback) => {
    db.query(dbConstants.emailExists, [email], callback )
}

exports.registerUser = (req, callback) => {
    db.query(dbConstants.registerUser, 
        [req.firstName, req.lastName, req.address, req.email, req.password, req.isAdmin], 
        (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.getUsersList = (req, callback) => {
    db.query(dbConstants.getUserList, (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.getUsersListByProject = (req, callback) => {
    db.query(dbConstants.getUserListByProject, [req.params.projectId], (error, result) => {
            if(error){
                callback(error, null)
            } else callback(null, result)
    })
}

exports.updateProfile = (req, callback) => {
    db.query(dbConstants.updateProfile, [req.body.firstName, req.body.lastName, req.body.email, req.body.address, req.body.id], (error, result) => {
            if(error){
                callback(error, null)
            } else {
                let message = `Hello ${req.body.firstName} ${req.body.lastName}, Your profile has been updated, Enjoy with PMS Services.`; 
                mailOptions.subject = `PMS Profile Update`;
                mailOptions.to =  req.body.email;
                mailOptions.html = commonEmailTemplate(mailOptions.subject, message);
                sendNotificationEmail(mailOptions, (info) => {
                    console.log("Emai has been sent, MESSAGE ID: ", info.messageId);
                    callback(null, result)
                })
            }
    })
}

exports.getUserTaskDueInTwoDays = (req, callback) => {
    let query = isAdmin(req) ? 'AND p.updatedBy = ? ORDER BY dueDate;' : 'AND U.id = ? ORDER BY dueDate;';
    db.query(dbConstants.getUserTasksDueDateIsTomorrow + query, [2, getUserId(req)], (error, result) => {
        if(error){
            callback(error, null)
        } else {
            callback(error, result)
        }
    })
}

exports.getProjectsDueInTwoDays = (req, callback) => {
    let query = isAdmin(req) ? dbConstants.getAllProjects + 'AND completionDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL ? DAY)  ORDER BY completionDate;' : dbConstants.getAllProjectsForUser + 'AND projects.completionDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL ? DAY) ORDER BY completionDate;';
            db.query(query, [getUserId(req), 2], (error, result) => {
        if(error){
            callback(error, null)
        } else {
            callback(error, result)
        }
    })
}
