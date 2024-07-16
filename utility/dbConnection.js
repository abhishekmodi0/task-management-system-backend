const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createPool({
   connectionLimit: 100,
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   port: process.env.DB_PORT
})

module.exports=connection;
