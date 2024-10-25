const bcrypt = require("bcryptjs");

const { generateAccessToken } = require("../utility/authorization");
const userService = require('../services/user.service');
const errorConstants  = require('../constants/errorConstants');
const successConstants = require("../constants/successConstants");

exports.registerUser = (req, callback) => {
    userService.checkIfEmailExists(req.email, async (error, result) => {
        if(error){
            callback(error, [])
        } else if(result.length > 0){
            callback(errorConstants.emailExists, [])
        } else {
            req.password = await bcrypt.hash(req.password, 10);
            userService.registerUser(req, callback)
        }
    })
}

exports.userLogin = (req, callback) => {
    userService.checkIfEmailExists(req.email, async (error, result) => {
        if(error){
            callback(error, result)
        } else if(result.length > 0) {
            let password = globalThis.atob(req.password);
            if(await  bcrypt.compare(password, result[0].password)){
                const token  = await generateAccessToken({ user : req.email});
                const response = successConstants.loginSuccess;
                delete result[0].password;
                response[0].user = result[0],
                response[0].token = token;
                callback(error, response)
            } else callback(errorConstants.invalidCredentials, [])
        } else {
            callback(errorConstants.invalidCredentials, [])
        }
    })
}

exports.getUsersList = (req, res) => {
    userService.getUsersList(req, (err, result)=> {
        if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
        else res.status(200).json(result)
    })
}

exports.getUsersListByProject = (req, res) => {
    userService.getUsersListByProject(req, (err, result)=> {
        if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
        else res.status(200).json(result)
    })
}

exports.updateProfile = (req, res, callback) => {
    userService.checkIfEmailExists(req.body.email, async (error, result) => {
        if(error){
            callback(error, [])
        } else if(result.length > 0 && result[0].id != req.body.id ){
            callback(errorConstants.emailExists, [])
        } else {
            userService.updateProfile(req,(error, result) => {
                if(error){
                    callback(error, [])
                } else  res.status(200).json(successConstants.profileUpdated)
            })
        }
    })
}

exports.getDashboardDetails = (req, res, callback) => {
    let response = {}
    userService.getUserTaskDueInTwoDays(req, async (error, result) => {
        if(error){
            callback(error, [])
        } else{
            response.tasks = result
            userService.getProjectsDueInTwoDays(req, async (e, r) => {
                if(e){
                    callback(e, [])
                } else{
                    response.projects = r
                    callback(e, response)
                    
                }
            })
        }
    })
}
