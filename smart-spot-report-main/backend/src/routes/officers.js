const express = require("express");
const router = express.Router();
const c = require("../controllers/officersController");

router.get("/", c.listOfficers);
router.post("/", c.createOfficer);
router.patch("/:id", c.updateOfficer);
router.delete("/:id", c.deleteOfficer);

module.exports = router;
