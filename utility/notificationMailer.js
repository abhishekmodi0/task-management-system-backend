const  nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_APP_USER,
        pass: process.env.APP_PASS_KEY,
    },
});

/** create reusable sendmail function 
@params {object} options - mail options (to, subject, text, html)
@params {function} callback - callback function to handle response
*/
exports.sendNotificationEmail = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails)
        callback(info);
    } catch (error) {
        console.log(error);
    } 
};

exports.mailOptions = {
    from: "PMS Update <sender@gmail.com>", // sender address
    to: "test@gmail.com", // receiver email
    subject: "Subject", // Subject line
    html: {},
}
