const jwt = require("jsonwebtoken"); 
const { ACCESS_TOKEN_SECRET } = process.env; 

const userService = require("../services/user.service"); 
const errorConstants = require("../constants/errorConstants");

exports.verifyAccessToken = async (req, res, next) => { 

	const token = req.header("Authorization"); 
	if (!token) return res.status(400).json(errorConstants.tokenMissing);
    let user;
    try {
        user = await jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch {
        return res.status(401).json(errorConstants.tokenExpired);
    } finally {
        if(user){
            userService.checkIfEmailExists(user.user, (error, result) => {
                if(error){
                    return res.status(404).json(errorConstants.invalidCredentials);
                } else {
                    req.body.user = result; 
                    next(); 
                }
            }); 
        }
    }    
}
