const express = require("express");
const urlRoutes = require("./src/routes/url.routes");
const app = express();
app.use(express.json());

app.use("/api/v1", urlRoutes);
module.exports = app;
