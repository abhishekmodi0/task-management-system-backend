const bcrypt = require("bcryptjs");
const db = require("../utility/dbConnection");
const authorization = require("../utility/authorization");
const dbConstants  = require('../constants/databaseConstants');
const errorConstants  = require('../constants/errorConstants');
const successConstants = require("../constants/successConstants");

const registerUser = (req, callback) => {
    checkIfEmailExists(req.email, async (error, result) => {
        if(error){
            callback(error, [])
        } else if(result.length > 0){
            callback(errorConstants.emailExists, [])
        } else {
            const hashedPassword = await bcrypt.hash(req.password, 10);
            db.query(dbConstants.registerUser, [req.firstName, req.lastName, req.address, req.email, hashedPassword], callback);
        }
    })
}
const userLogin = (req, callback) => {
    checkIfEmailExists(req.email, async (error, result) => {
        if(error){
            callback(error, result)
        } else if(result.length > 0) {
            let password = globalThis.atob(req.password);
            if(await  bcrypt.compare(password, result[0].password)){
                const token  = await authorization({ user : req.email});
                const response = successConstants.loginSuccess;
                delete result[0].password;
                response[0].user = result[0],
                response[0].token = token;
                callback(error, response)
            }
        } else {
            callback(errorConstants.invalidCredentials, [])
        }
    })
}

const checkIfEmailExists = (email, callback) => {
    db.query(dbConstants.emailExists, [email], callback )
}

module.exports = {registerUser, userLogin, checkIfEmailExists};
