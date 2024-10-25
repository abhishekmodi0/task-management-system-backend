const jwt = require("jsonwebtoken");

const errorConstants = require('../constants/errorConstants')

exports.generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"})
}

exports.validateAdminUser = (req, res, next) => { 
    if(req.body.user[0].isAdmin === 0){
        return res.status(400).json(errorConstants.unAuthorized);
    } else next();
}

exports.isAdmin = (req) => { return req.body.user[0].isAdmin === 1 }

exports.getUserId  = (req) => {  return req.body.user[0].id }
