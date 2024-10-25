const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const projectRouter = require('./project.router');
const taskRouter = require('./task.router');
const commonValidators = require('../validators/common.validators')
const userController=require('../controllers/user.controller');
const successConstants  = require('../constants/successConstants');
const { verifyAccessToken } = require('../utility/verifyAccessToken');

router.use('/projects', verifyAccessToken, projectRouter);
router.use('/tasks', verifyAccessToken, taskRouter);

router.put('/updateProfile', verifyAccessToken, commonValidators.updateProfile, (req,res,next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        userController.updateProfile(req, res, (error, result)=> {
            if(error){ 
                res.status(400).json({ error: error });
            } else {
                const response = successConstants.userRegistred;
                response[0].userId = result.insertId
                res.status(200).json(response)
            }
        })
    } else res.status(400).json({ error: [ {message : result.errors[0].msg}]});
});

router.get('/getDashboardStats', verifyAccessToken, (req,res,next) => {
    userController.getDashboardDetails(req, res, (error, result)=> {
        if(error){ 
            res.status(400).json({ error: error });
        } else {
            res.status(200).json(result)
        }
    });
})


router.post('/register', commonValidators.register, (req,res,next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        userController.registerUser(req.body, (error, result)=> {
            if(error){ 
                res.status(400).json({ error: error });
            } else {
                const response = successConstants.userRegistred;
                response[0].userId = result.insertId
                res.status(200).json(response)
            }
        })
    } else res.status(400).json({ error: [ {message : result.errors[0].msg}]});
});

router.post('/login', commonValidators.login, (req,res,next) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        userController.userLogin(req.body, (error, result) => {
            if(error){
                res.status(401).json({ error: error });
            } else{ 
                res.status(200).json(result)
            }
    
        })
    } else res.status(400).json({ error: [ {message : result.errors[0].msg}]}); 
});

module.exports=router;
