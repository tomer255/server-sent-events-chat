"use strict";

const express = require("express");
const api = require("./api");

const app = express();

app.use("/api", api);

app.listen(8080, () => console.log("Listening on port 8080"));
