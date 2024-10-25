const {validationResult, body } = require("express-validator");

const projectService = require('../services/project.service')
const successConstants  = require('../constants/successConstants');
const { getUsersListByProject } = require("../services/user.service");


exports.createProject = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        projectService.createProject(req.body, async (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else if(result.affectedRows > 0){
                req.body.create = true;
                assignMultipleUsersToProject(req.body, result.insertId, (error, response)=> {
                    if(error) res.status(400).json({error: [ {message : `SQL error, ${error.sqlMessage}`}]});
                    else if(response.affectedRows > 0){
                        res.status(200).json(successConstants.createProjectSuccess);
                    }
                })    
            } else res.status(200).json(successConstants.createProjectSuccess);
        })
    }
}

exports.editProject = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        req.body.create = false;
        projectService.editProject(req, (err, result)=> {
            if(err) { res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            } else if (req.body.recordsToBeDeleted.length > 0) {
                projectService.removeProjectAccessFromUsers(req, (e, deleted)=> {
                    if(e) res.status(400).json({error: [ {message : `SQL error, ${error.sqlMessage}`}]});
                    else if (req.body.newRecordsAdded){
                        req.body.recordsToBeDeleted = [];
                        assignMultipleUsersToProject(req.body, req.params.id, (error, response)=> {
                            if(error) res.status(400).json({error: [ {message : `SQL error, ${error.sqlMessage}`}]});
                            else if(response.affectedRows > 0){
                                res.status(200).json(successConstants.createProjectSuccess);
                            }
                        })
                        
                    } else { res.json(successConstants.updateProjectSuccess); }
                })
            } else if(req.body.newRecordsAdded) {
                assignMultipleUsersToProject(req.body, req.params.id, (error, response)=> {
                    if(error) res.status(400).json({error: [ {message : `SQL error, ${error.sqlMessage}`}]});
                    else if(response.affectedRows > 0){
                        res.status(200).json(successConstants.createProjectSuccess);
                    }
                }) 
            } else res.status(200).json(successConstants.updateProjectSuccess)
            
        })
    }
}

exports.deleteProject = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        projectService.deleteProject(req.params, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(successConstants.deleteProjectSuccess)
        })
    }
}

exports.getAllProjects = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: [ {message : `${errors.errors[0].msg} for ${errors.errors[0].path}`}]});
    } else {
        projectService.getAllProjects(req, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else res.status(200).json(result)
        })
    }
}

exports.getProjectById = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        projectService.getProjectById(req.params, (err, result)=> {
            if(err) res.status(400).json({error: [ {message : `SQL error, ${err.sqlMessage}`}]});
            else {
                req.params.projectId = req.params.id
                getUsersListByProject(req, (e, users) => {
                    if(e) res.status(400).json({error: [ {message : `SQL error, ${e.sqlMessage}`}]});
                    else {
                        result[0].users = users.map(e => e.id.toString());
                        res.status(200).json(result)
                    }
                })
            }
        })
    }
}

async function assignMultipleUsersToProject(body, insertId, callback) {
    let values = [];
    await body.assignedTo.forEach(element => {
        values.push([element, insertId, body.user[0].id]);
    });
    projectService.assignMultipleUsersToProject([values], (error, response) => {
        if(error) callback(error, [])
        else { 
            projectService.sendProjectNotificationToUser(body.assignedTo, body, (e, res) => {
                callback(error, response)
            })
        }
    })
}
