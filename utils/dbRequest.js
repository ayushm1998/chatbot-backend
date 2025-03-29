const sql = require("mssql");

// sending request to the database
const dbrequest = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      const request = new sql.Request();
      request.query(query, async (err, recordset) => {
        if (err) {
          reject(err.originalError.info.message || err);
        } else {
          resolve(recordset.recordset);
        }
      });
    } catch (error) {
      reject(error.message);
    }
  });
};

module.exports = dbrequest;
