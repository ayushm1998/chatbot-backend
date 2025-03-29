const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appRoot = require("app-root-path");
const dbQuery = require(appRoot + "/helpers/dbQuery.json");
const responseMessage = require(appRoot + "/helpers/responseMessage.json");
const dbrequest = require(appRoot + "/utils/dbrequest");
const format = require("pg-format");

const login = (userInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = userInfo;
      let formattedquery = format(dbQuery.login.checkUser, userInfo.email);
      let userExist = await dbrequest(formattedquery).catch((err) =>
        reject(err)
      );
      if (userExist.length === 0) {
        reject(responseMessage.login.Invalid_User);
      } else {
        let studentId = userExist[0].studentId;
        let scope = userExist[0].access;

        if (email && bcrypt.compareSync(password, userExist[0].password)) {
          const token = jwt.sign({ email, studentId, scope }, "secretKey", {
            expiresIn: "1h",
          });
          resolve(token);
        } else {
          reject(responseMessage.login.Invalid_Credentials);
        }
      }
    } catch (err) {
      reject(err.message);
    }
  });
};

module.exports = login;
