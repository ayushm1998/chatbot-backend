const express = require("express");
const router = express.Router();

const login = require("../controllers/login.js");

router.route("/token").post(login); 
module.exports = router;
