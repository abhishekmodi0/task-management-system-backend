const db = require("../utility/dbConnection");
const dbConstants  = require('../constants/databaseConstants');

const createTask = (req, callback) => {
    db.query(dbConstants.createTask, [req.user[0].id, req.title, req.description, req.dueDate], callback)
}

const updateTask = (req, callback) => {
    db.query(dbConstants.updateTask, [req.title, req.description, req.dueDate, req.id], callback)
}

const updateTaskStatus = (req, callback) => {
    db.query(dbConstants.updateTaskStatus, [req.status, req.id], callback)
}

const deleteTask = (id, callback) => {
    db.query(dbConstants.deleteTask, [id], callback)
}

const listTasks = (req, callback) => {
    db.query(dbConstants.getAllTasksForUser, [req[0].id], callback)
}

module.exports = {createTask, updateTask, deleteTask, listTasks, updateTaskStatus};
