const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");

const SVITA_JSON_FILE = __dirname + "/../../svita.json";

const app = express();

app.set("port", process.env.PORT || 3001);
app.use(bodyParser.json({
  limit: "1mb"
}));

app.get("/api/get", (req, res, next) => {
  fs.readFile(SVITA_JSON_FILE, (err, content) => {
    if (err) {
      next(err);
    } else {
      res.json(JSON.parse(content));
    }
  });
});

app.post("/api/put", function (req, res) {
  fs.writeFile(
      SVITA_JSON_FILE,
      JSON.stringify(req.body, null, 2),
      (err) => {
        if (err) {
          next(err);
        } else {
          res.json(req.body); // Send the songs back.
        }
      });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
