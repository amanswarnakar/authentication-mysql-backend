const mysql = require("mysql");
require("dotenv").config();

/* This is creating a connection to the database. */

var config_db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  connectionLimit: 1,
  endConnectionOnClose: true,
  charset: "utf8mb4_bin",
};

var db = mysql.createPool(config_db);
// or mysql.createConnection(config_db);

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("🗃  DB connected successful: ", connection.threadId);
  connection.release();
});

module.exports = db;
