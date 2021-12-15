const mysql = require("mysql2/promise");

//why not?
const queryAsync = async (query) => {
    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'chat'});
    const [rows, fields] = await connection.execute(query, );
    await connection.end()
    return rows
}

module.exports = queryAsync