const express = require("express");
const fs = require("fs");

const SVITA_JSON_FILE = __dirname + "/../../svita.json";

const app = express();

app.set("port", process.env.PORT || 3001);

app.get("/api/get", (req, res, next) => {
  fs.readFile(SVITA_JSON_FILE, (err, content) => {
    if (err) {
      next(err);
    } else {
      res.json(JSON.parse(content));
    }
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
