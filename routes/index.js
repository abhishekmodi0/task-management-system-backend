const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require("express-validator");
const userController=require('../controllers/user.controller');
const taskController=require('../controllers/task.controller');
const successConstants  = require('../constants/successConstants');
const { verifyAccessToken } = require('../utility/verifyAccessToken');


router.post('/register', 
    body("email").isEmail().withMessage("invalid email entered"),
    body("password").notEmpty().withMessage("Password can not be empty"), 
    body("firstName").notEmpty().withMessage("First name can not be empty"), 
    body("lastName").notEmpty().withMessage("Last name can not be empty"), 
    body("address").notEmpty().withMessage("Address can not be empty"), 
    (req,res,next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        userController.registerUser(req.body, (error, result)=> {
            if(error){ 
                res.status(400).json({ error: error });
            } else {
                const response = successConstants.userRegistred;
                response[0].userId = result.insertId
                res.json(response)
            }
        })
    } else res.status(400).json({ error: [ {message : result.errors[0].msg}]});

});

router.post('/login', 
    body("email").isEmail().withMessage('Email id is not valid'),
    body("password").notEmpty().withMessage('Password can not be empty'), 
    (req,res,next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        userController.userLogin(req.body, (error, result) => {
            if(error){
                res.status(400).json({ error: error });
            } else{ 
                res.json(result)
            }
    
        })
    } else res.status(400).json({ error: [ {message : result.errors[0].msg}]}); 
});

router.post('/task/create', verifyAccessToken,
    body("title").notEmpty().isString().isLength({min : 1, max : 100}),
    body("description").notEmpty().isString().isLength({min : 1, max : 255}), 
    body("dueDate").notEmpty().isString().isDate({ format : 'dd-mm-yyyy'}).withMessage('Date Format required is dd-mm-yyyy'), 
    (req, res, next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        taskController.createTask(req.body, (error, result) => {
            if(error){
                res.status(400).json({ error: error });            
            } else {
                res.json(successConstants.createTaskSuccess);
            }
        })
    } else res.status(400).json({ error: [ {message : result.errors[0].msg}]}); 
});

router.put('/task/update', verifyAccessToken, 
    body("id").notEmpty().isInt(),
    body("title").notEmpty().isString().isLength({min : 1, max : 100}),
    body("description").notEmpty().isString().isLength({min : 1, max : 255}), 
    body("dueDate").notEmpty().isString().isDate({ format : 'dd-mm-yyyy'}), 
    (req, res, next) => {
        const result = validationResult(req);
        if(result.isEmpty()) {
            taskController.updateTask(req.body, (error, result) => {
                if(error){
                    res.json(error);
                } else {
                    res.json(successConstants.updateTaskSuccess);
                }
            })
        } else res.send({ errors: result.array() });
});

router.put('/task/updateTaskStatus/:id/:status', verifyAccessToken,
    param('id').notEmpty().isInt(),
    param('status').notEmpty().isInt(),
    (req, res, next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        taskController.updateTaskStatus(req.params, (error, result) => {
            if(error){
                res.json(error);
            } else {
                res.json(successConstants.updateTaskStatusSuccess);
            }
        })
    } else res.send({ errors: result.array() });
});

router.delete('/task/delete/:id', verifyAccessToken,
    param('id').notEmpty().isInt(),
    (req, res, next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        taskController.deleteTask(req.params.id, (error, result) => {
            if(error){
                res.json(error);
            } else {
                result.affectedRows >= 1 ? res.json(successConstants.deleteTaskSuccess) :  
                res.json(successConstants.noRecordsToDelete)
            }
        })
    } else res.send({ errors: result.array() });
});

router.get('/task/listAllTasks', verifyAccessToken, (req, res, next) => {
    taskController.listTasks(req.body.user, (error, result) => {
        if(error){
            res.json(error)
        } else res.json(result)
    })
});

router.get('/task/getById/:id', verifyAccessToken,
    param('id').notEmpty().isInt(),
    (req, res, next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        taskController.getTaskById(req.params.id, (error, result) => {
            if(error){
                res.json(error);
            } else {
                res.json(result)
            }
        })
    } else res.send({ errors: result.array() });
});

module.exports=router;
