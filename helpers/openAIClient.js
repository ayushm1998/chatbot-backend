const { AzureOpenAI } = require("openai");
require("@azure/openai/types");

function openaiclient() {
  const endpoint = process.env.VITE_AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.VITE_AZURE_OPENAI_API_KEY;
  const apiVersion = process.env.VITE_OPENAI_API_VERSION;
  const deployment = process.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID;
  const searchEndpoint = process.env.VITE_AZURE_AI_SEARCH_ENDPOINT;
  const searchKey = process.env.VITE_AZURE_AI_SEARCH_API_KEY;
  const searchIndex = process.env.VITE_AZURE_AI_SEARCH_INDEX;

  if (!searchEndpoint || !searchKey || !searchIndex) {
    console.error("Please set the required Azure AI Search environment variables.");
    return;
  }
  const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment,
    dangerouslyAllowBrowser: true,
  });
  return client;
}

module.exports=openaiclient