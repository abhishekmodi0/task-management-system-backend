const {validationResult } = require("express-validator");

const taskService = require('../services/task.service');
const successConstants  = require('../constants/successConstants');

exports.getFormFields = (req, res) => {
    taskService.getFormFields((err, result)=> {
        if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
        else res.status(200).json(result)
    })
}

exports.createTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        taskService.createTask(req, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(successConstants.createTaskSuccess)
        })
    }
}

exports.editTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        taskService.editTask(req, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(successConstants.updateTaskSuccess)
        })
    }
}

exports.getProjectTasks = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        taskService.getAllTasks(req, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(result)
        })
    }
}

exports.deleteTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        taskService.deleteTask(req.params, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(successConstants.deleteTaskSuccess)
        })
    }
}

exports.getTaskById = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        taskService.getTaskById(req, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(result)
        })
    }
}
