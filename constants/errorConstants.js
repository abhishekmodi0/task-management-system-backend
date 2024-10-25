const errorConstants = {
    emailExists : [{message : "duplicate user found with same email id, please try with another email"}],
    unAuthorized : [{message : "You are not authorized to perform this operation"}],
    invalidCredentials : [{message : "email or password is incorrect"}],
    tokenMissing : [{message : "Invalid or missing token"}],
    tokenExpired : [{message : "JWT token shared by you has been expired, please re-login to generate new token "}],
}

module.exports = errorConstants;
