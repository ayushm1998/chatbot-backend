const loginToken = require('../logic/login.js')
const { failureResponse, successResponse } = require('../utils/responseSchema')
const statusCodes = require('../utils/statusCodes.json')


const login = async (req, res) => {      
    try {
        let user = req.body
        let token = await loginToken(user).catch(error => {
            let failure = failureResponse(statusCodes.BAD_REQUEST.status, error, statusCodes.BAD_REQUEST.statusCode)
            res.status(failure.statusCode).send(failure.body)
        })
        if (token) {
            let success = successResponse(token, statusCodes.OK.statusCode)
            res.status(success.statusCode).send(success.body)
        }
    } catch (error) {
        let failure = failureResponse(statusCodes.INTERNAL_SERVER_ERROR.status, error.message, statusCodes.INTERNAL_SERVER_ERROR.statusCode)
        res.status(failure.statusCode).send(failure.body)
    }
}

module.exports = login