const { body } = require("express-validator");

exports.register = [
    body("email").isEmail().withMessage("invalid email entered"),
    body("password").notEmpty().withMessage("Password can not be empty"), 
    body("firstName").notEmpty().withMessage("First name can not be empty"), 
    body("lastName").notEmpty().withMessage("Last name can not be empty"), 
    body("address").notEmpty().withMessage("Address can not be empty"), 
]

exports.login = [
    body("email").isEmail().withMessage('Email id is not valid'),
    body("password").notEmpty().withMessage('Password can not be empty'), 
]

exports.updateProfile = [
    body("email").isEmail().withMessage("invalid email entered"),
    body("firstName").notEmpty().withMessage("First name can not be empty"), 
    body("lastName").notEmpty().withMessage("Last name can not be empty"), 
    body("address").notEmpty().withMessage("Address can not be empty"), 
]
