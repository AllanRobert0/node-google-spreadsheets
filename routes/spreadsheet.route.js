const controller = require("../controller/spreadsheet.controller");
const express = require("express");
const router = express.Router();

router.get("/list", controller.loadRows);
router.post("/add", controller.addRow);
router.delete("/delete/:id", controller.deleteRow);

module.exports = router;
