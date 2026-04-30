const express = require("express");
const router = express.Router();
const { detectGarbage } = require("../controllers/detectController");

router.post("/", detectGarbage);

module.exports = router;
