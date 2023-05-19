const express = require("express");
const router = express.Router();
const { sendAll, connect, disconnect } = require("./service");

router.use("/sendAll", sendAll);
router.use("/connect", connect);
router.use("/disconnect", disconnect);

module.exports = router;
