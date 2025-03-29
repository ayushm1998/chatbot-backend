var axios = require("axios");

//Axios Module for REST APIs
async function apiRequest(apiURL, apiMethod, body) {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        url: apiURL,
        method: apiMethod,
        data: body,
      };
      await axios(options) //Axios request for required method
        .then((response) => {
          resolve({
            data: response.data,
            statusCode: response.status,
          });
        })
        .catch((err) => {
          reject({
            error: err.response.data.error || err.message,
            statusCode: err.response.status || 400,
          });
        });
    } catch (err) {
      reject(err.message);
    }
  });
}
module.exports = apiRequest;
