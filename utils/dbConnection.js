const sql = require("mssql");
require("dotenv").config();

const config = {
  server: process.env.server,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
  options: {
    trustedConnection: true,
  },
};

//Database connection
function dbConnection() {
  // Connecting to Ms Sql database
  return new Promise((resolve, reject) => {
    try {
      sql.connect(config, (err) => {
        if (err) {
          console.log(err);
          reject("Failed to open a SQL Database connection.", err.stack);
        }
        resolve("SQL connected");
      });
    } catch (err) {
      reject("Failed to connect to a SQL Database connection.", err.message);
    }
  });
}
module.exports = dbConnection;
