const appRoot = require("app-root-path");

require("@azure/openai/types");
require("dotenv").config();
const openaiclient = require(appRoot + "/helpers/openAIClient.js");
const getStudentInfo = require(appRoot + "/logic/getStudentInfo.js");
const getHolds = require(appRoot + "/logic/getHolds.js");
const getAdmissionDecision = require(appRoot +"/logic/getAdmissionDecision.js");
const checkIfUserExist = require(appRoot + "/logic/checkUserExist.js");
const getAssistantResponseFromIPGEData = require(appRoot +"/logic/getAssistantResponseFromIPGEData.js");
const getStudentId = require(appRoot + "/logic/getStudentId.js");
const getTools = require(appRoot + "/helpers/tools.json");
const { jwtDecode } = require("jwt-decode");
const client = openaiclient();

async function conditionalCall(history, user) {
  try {
    // Define functions for the model
    const tools = getTools;
    const userInfo = jwtDecode(user);
    if (userInfo.scope != "guest") {
      // First API call: Ask the model to use the functions
      const response = await client.chat.completions.create({
        model: process.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID,
        messages: history,
        tools,
        tool_choice: "auto",
      });
      // Process the model's response
      const responseMessage = response.choices[0].message;
      history.push(responseMessage);
      // Handle function calls
      if (responseMessage.tool_calls) {
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          //console.log(functionArgs)
          let functionResponse;
          if (functionName === "getStudentId") {
            functionResponse = await getStudentId(user);
          }
          if (functionName === "getStudentInfo") {
            functionResponse = await getStudentInfo(functionArgs.studentId, user);
          } else if (functionName === "getHolds") {
            functionResponse = await getHolds(functionArgs.studentId, user);
          } else if (functionName === "checkIfUserExist") {
            functionResponse = await checkIfUserExist(functionArgs.studentId,user);
          } else if (functionName === "getAdmissionDecision") {
            functionResponse = await getAdmissionDecision(functionArgs.studentId,user);
          }

          history.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse || "Not Found",
          });
        }
      } else {
        history = history.map(({ role, content }) => ({ role, content }));

        let functionResponse = await getAssistantResponseFromIPGEData(history);
        history.push({
          role: "assistant",
          content: functionResponse || "Not Found",
        });
      }
    } else {
      history = history.map(({ role, content }) => ({ role, content }));
      let functionResponse = await getAssistantResponseFromIPGEData(history);
      history.push({
        role: "assistant",
        content:
          functionResponse ||
          "I can only proved basic details if you are logged in as a guest, please login with csus credentials if you need help with your account speicifically",
      });
    }

    // Second API call: Get the final response from the model
    const finalResponse = await client.chat.completions.create({
      model: process.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID,
      messages: history,
    });

    return finalResponse.choices[0].message.content;
  } catch (err) {
    return err;
  }
}

module.exports = conditionalCall;
