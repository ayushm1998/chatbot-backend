const appRoot = require("app-root-path");
const dbQuery = require(appRoot + "/helpers/dbQuery.json");
const responseMessage = require(appRoot + "/helpers/responseMessage.json");
const dbrequest = require(appRoot + "/utils/dbrequest");
const format = require("pg-format");
const { jwtDecode } = require("jwt-decode");

const checkUserExist = (studentId, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = jwtDecode(user);
      if (userInfo.scope == true || studentId == userInfo.studentId) {
        let formattedquery = format(dbQuery.Student.checkUser, studentId);
        let userExist = await dbrequest(formattedquery).catch((err) =>
          reject(err)
        );
        if (userExist.length === 0) {
          reject(responseMessage.Student.student_doesnt_exist);
        } else {
          resolve(JSON.stringify(userExist[0]));
        }
      } else {
        reject(responseMessage.Student.Not_Authorized);
      }
    } catch (err) {
      reject(err.message);
    }
  });
};

module.exports = checkUserExist;
