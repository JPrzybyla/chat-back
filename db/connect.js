const mysql = require("mysql2");

let db_con  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'chat'
});

module.exports = db_con;