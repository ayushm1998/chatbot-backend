const appRoot = require("app-root-path");
const dbQuery = require(appRoot + "/helpers/dbQuery.json");
const responseMessage = require(appRoot + "/helpers/responseMessage.json");
const dbrequest = require(appRoot + "/utils/dbrequest");
const format = require("pg-format");
const { jwtDecode } = require("jwt-decode");

const getStudentInfo = (studetnId, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = jwtDecode(user);
      if (userInfo.scope == true || studetnId == userInfo.studentId) {
        let formattedquery = format(dbQuery.Student.getStudentData, studetnId);
        let studentInfo = await dbrequest(formattedquery).catch((err) =>
          reject(err)
        );
        if (studentInfo.length === 0) {
          reject(responseMessage.Student.student_not_found);
        } else {
          resolve(JSON.stringify(studentInfo[0]));
        }
      } else {
        reject(responseMessage.Student.Not_Authorized);
      }
    } catch (err) {
      reject(err.message);
    }
  });
};

module.exports = getStudentInfo;
