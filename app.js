require("dotenv").config();
const express = require("express");
const spreadsheetRoute = require("./routes/spreadsheet.route");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ADDRESS);
  next();
});

app.use("/item", spreadsheetRoute);
app.use("/", (req, res) => {
  res.send("Home Page");
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(
    `App listening on port ${PORT} \nAllowed Address ${process.env.ALLOWED_ADDRESS}`
  );
});
