const express = require("express");
const router = express.Router();
const c = require("../controllers/reportsController");

router.get("/", c.listReports);
router.get("/:id", c.getReport);
router.post("/", c.createReport);
router.patch("/:id", c.updateReport);

module.exports = router;
