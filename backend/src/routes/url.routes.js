const express = require("express");
const urlController = require("../controllers/url.controller");
const router = express.Router();


router.post("/urls", urlController.createShortUrl);
router.get("/:shortkey", urlController.redirect);

module.exports = router;