require("@azure/openai/types");
const openaiclient = require("../helpers/openAIClient.js");

async function getAssistantResponseFromIPGEData(messages) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = openaiclient();
      const result = await client.chat.completions.create({
        model: "",
        messages,
        data_sources: [
          {
            type: "azure_search",
            parameters: {
              endpoint: process.env.VITE_AZURE_AI_SEARCH_ENDPOINT,
              index_name: process.env.VITE_AZURE_AI_SEARCH_INDEX,
              authentication: {
                type: "system_assigned_managed_identity",
              },
            },
          },
        ],
      });
      resolve(JSON.stringify(result, null, 2));
    } catch (err) {
      reject(err.message);
    }
  });
}

module.exports = getAssistantResponseFromIPGEData;
