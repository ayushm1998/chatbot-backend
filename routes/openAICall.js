const express = require("express");
const router = express.Router();

const openAICallResponse = require("../controllers/getAssistantResponse.js");

router.route("/openaicall").post(openAICallResponse); 
module.exports = router;
