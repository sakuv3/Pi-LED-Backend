const express = require('express');
const cors = require("cors");
const app = express();
const fs = require("fs");
const { exec } = require("child_process");
const PORT = 33333
const filename = __dirname + "/test.json";

app.use(express.json());
app.use(cors());

// Middleware
function log(req, res, next) {
  console.log(req.method + " Request at " + req.url);
  next();
}
app.use(log);

function off(){
  var cmd = "python led_scripts/off.py"
  exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      //stdout:
      console.log(`${stdout}`);
  });
}

//Endpunkte
// ignore this
app.get('/favicon.ico', function(req, res) {
    res.status(204);
    res.end();
});

// command
app.get('/dimm', function(req,res) {
  var cmd = "python led_scripts/dimm.py"
  exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      //stdout:
      console.log(`${stdout}`);
  });
});

// command
app.get('/rain', function(req,res) {
  var cmd = "python led_scripts/rain.py"
  exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      //stdout:
      console.log(`${stdout}`);
  });
});

// command
app.get('/off', function(req,res) {
  off();
});

// test
app.get("/test", function (req, res) {
  fs.readFile(filename, "utf8", function (err, data) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  });
});


// Start server
app.listen(PORT, () => {
  console.log('Server listening for requests on port ' + PORT);
});
