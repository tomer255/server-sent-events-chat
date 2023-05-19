const express = require("express");
const router = express.Router();
const events = require("./events/route");
const morgan = require("morgan");
const cors = require("cors");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());
router.use(morgan("dev"));

router.use("/events", events);

router.get("/", (req, res) => res.send("server is up"));

module.exports = router;
