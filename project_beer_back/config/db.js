const mysql = require('mysql')
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database:"project_beer" 
})

module.exports = db;