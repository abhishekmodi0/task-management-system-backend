const { body, param } = require("express-validator");

exports.createTask = [
    body("title").notEmpty().isString().isLength({min : 1, max : 100}),
    body("description").notEmpty().isString().isLength({min : 1, max : 255}), 
    body("dueDate").notEmpty().isString().isDate({ format : 'dd-mm-yyyy'}).withMessage('Date Format required is dd-mm-yyyy'),
    body("projectId").notEmpty().isInt(),
    body("status").notEmpty().isIn([1, 2, 3]),
    body("priority").notEmpty().isIn([1, 2, 3]),
    body("tagName").notEmpty().isIn([1, 2, 3]),
    body("assignedTo").notEmpty().isIn([1, 2, 3]),
]

exports.editTask = [ 
    body("title").notEmpty().isString().isLength({min : 1, max : 100}),
    body("description").notEmpty().isString().isLength({min : 1, max : 255}), 
    body("dueDate").notEmpty().isString().isDate({ format : 'dd-mm-yyyy'}).withMessage('Date Format required is dd-mm-yyyy'),
    body("projectId").notEmpty().isInt(),
    body("status").notEmpty().isIn([1, 2, 3]),
    body("priority").notEmpty().isIn([1, 2, 3]),
    body("tagName").notEmpty().isIn([1, 2, 3]),
    body("assignedTo").notEmpty().isInt(),    
    param("id").notEmpty().isInt(),    
]

exports.paramProjectIdValidation = [param("projectId").notEmpty().isInt()]

exports.paramIdValidation = [param("id").notEmpty().isInt()]
