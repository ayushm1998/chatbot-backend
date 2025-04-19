const appRoot = require("app-root-path");
const dbQuery = require(appRoot + "/helpers/dbQuery.json");
const responseMessage = require(appRoot + "/helpers/responseMessage.json");
const dbrequest = require(appRoot + "/utils/dbrequest");
const format = require("pg-format");
const { jwtDecode } = require("jwt-decode");

const getStudentId = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = jwtDecode(user);
      let formattedquery = format(dbQuery.Student.getStudentId, userInfo.email);
      let studentInfo = await dbrequest(formattedquery).catch((err) =>
        reject(err)
      );
      if (studentInfo.length === 0) {
        reject(responseMessage.Student.no_user);
      } else {
        resolve(JSON.stringify(studentInfo));
      }
    } catch (err) {
      reject(err.message);
    }
  });
};

module.exports = getStudentId;
