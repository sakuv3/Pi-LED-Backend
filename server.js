const { exec } = require("child_process");
let {PythonShell} = require('python-shell')
const express = require('express');
const cors = require("cors");
const fs = require("fs");
const filename = __dirname + "/test.json";
const PORT = 33333
const app = express();
app.use(express.json());
app.use(cors());


let options = {
  pythonPath: '/usr/bin/python2.7',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: 'led_scripts/',
};

// Middleware
let pyshell;
let running = false;

function log(req, res, next) {
  console.log(req.method + " Request at " + req.url);
  next();
}
function kill_python_process(){
    if (running){
        running = false;

    }
}
app.use(log);
//app.use(lights_off);


//Endpoints
app.get('/off', function(req,res) {
    //kill_python_process();
    pyshell = new PythonShell('off.py', options);

    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end("success");
});

app.get('/rain', function(req,res) {
    //kill_python_process();
    running = true;
    pyshell = new PythonShell('rain.py', options);

    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end("success");
});

app.get('/dimm', function(req,res) {
    kill_python_process();
    PythonShell.run('dimm.py', options, function (err) {
          if (err) throw err;
          console.log('finished');
    });
    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end("success");
});

app.get("/test", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    });
});

// ignore this
app.get('/favicon.ico', function(req, res) {
    res.status(204);
    res.end();
});

// Start server
app.listen(PORT, () => {
    console.log('Server listening for requests on port ' + PORT);
});
