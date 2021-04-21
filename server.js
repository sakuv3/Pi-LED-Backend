const { exec } = require("child_process");
let {PythonShell} = require('python-shell')
const express = require('express');
const cors = require("cors");
const fs = require("fs");
const filename = __dirname + "/test.json";
const app = express();
const PORT = 33333
app.use(express.json());
app.use(cors());

// Middleware
let pyshell;
let options = {
  pythonPath: '/usr/bin/python2.7',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: 'led_scripts/',
  args: 0
};
let running = false;

function log(req, res, next) {
  console.log(req.method + " Request at " + req.url);
  next();
}
function kill_if_python_process(){
    if (running){
        running = false;
        pyshell.kill('SIGINT');
    }
}
app.use(log);


// mainpage
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/app.js/', function(req, res) {
    res.sendFile(__dirname + "/app.js");
});

app.get('/app.css/', function(req, res) {
    res.sendFile(__dirname + "/app.css");
});
//Endpoints
app.get('/off/', function(req,res) {
    kill_if_python_process();
    PythonShell.run('off.py', options, function (err) {
        if (err) throw err;
    });
    res.status(200).json({msg:'off'});
});

app.get('/rain/:speed/', function(req,res) {
    kill_if_python_process();
    running = true;
    let speed = req.params.speed;
    console.log(options.args);
    options.args = speed;
    console.log(options.args);
    // script keeps running so we need an instance to be able to kill it
    pyshell = new PythonShell('rain.py', options);

    res.status(200).json({msg:'rain'});
});

app.get('/dimm/', function(req,res) {
    kill_if_python_process();
    running = true;
    PythonShell.run('dimm.py', options, function (err) {
          if (err) throw err;
    });
    res.status(200).json({msg:'dimm'});
});

app.get("/test/", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    });
});

// ignore favicon
app.get('/favicon.ico', function(req, res) {
    res.status(204);
    res.end();
});

// Start server
app.listen(PORT, () => {
    console.log('Server listening for requests on port ' + PORT);
});
