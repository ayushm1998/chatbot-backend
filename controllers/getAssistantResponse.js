const openAICall = require('../logic/openAICall.js')
const { failureResponse, successResponse } = require('../utils/responseSchema')
const statusCodes = require('../utils/statusCodes.json')


const openAICallResponse = async (req, res) => {      
    try {
        let history = req.body.history
        let user = req.body.user.token
        let botResponse = await openAICall(history,user).catch(error => {
            let failure = failureResponse( error, statusCodes.BAD_REQUEST.statusCode)
            res.status(failure.statusCode).send(failure.body)
        })
        if (botResponse) {
            let success = successResponse(botResponse, statusCodes.OK.statusCode)
            res.status(success.statusCode).send(success.body)
        }
    } catch (error) {
        let failure = failureResponse(statusCodes.INTERNAL_SERVER_ERROR.status, error.message, statusCodes.INTERNAL_SERVER_ERROR.statusCode)
        res.status(failure.statusCode).send(failure.body)
    }
}

module.exports = openAICallResponse