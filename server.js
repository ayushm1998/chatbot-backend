const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors());
const dbConnection = require("./utils/dbConnection");

const { openAICall, login } = require("./routes");

app.use("/api/bot", openAICall);
app.use("/api/login", login);
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Connect to DB the initlize server
dbConnection()
  .then((status) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `App listening at http://localhost:${process.env.PORT || 3000}`
      );
    });
  })
  .catch((err) => console.log(err));
