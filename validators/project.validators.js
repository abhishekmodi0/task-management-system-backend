const { body, param } = require("express-validator");

exports.createProject = [
    body("title").notEmpty().isString().isLength({min : 1, max : 100}),
    body("description").notEmpty().isString().isLength({min : 1, max : 255}),    
    body("completionDate").notEmpty().isString().isDate({ format : 'dd-mm-yyyy'})
        .withMessage('Date Format required is dd-mm-yyyy'),
    body("assignedTo").notEmpty().isArray()
    .withMessage('At-least one member is required'),
]

exports.editProject = [
    body("title").notEmpty().isString().isLength({min : 1, max : 100}),
    body("description").notEmpty().isString().isLength({min : 1, max : 255}),    
    body("completionDate").notEmpty().isString().isDate({ format : 'dd-mm-yyyy'})
        .withMessage('Date Format required is dd-mm-yyyy'),
    param("id").notEmpty().isInt(),    
]

exports.paramIdValidation = [param("id").notEmpty().isInt()]

exports.paramProjectIdValidation = [param("projectId").notEmpty().isInt()]
