const { exec } = require("child_process");
const express = require('express');
const cors = require("cors");
const fs = require("fs");
const filename = __dirname + "/test.json";
const PORT = 33333
const app = express();
app.use(express.json());
app.use(cors());


// Middleware
var python_process;
var running = false;

function log(req, res, next) {
  console.log(req.method + " Request at " + req.url);
  next();
}
function kill_python_process(){
    if (running){
        python_process.kill('SIGINT');
        running = false;
    }
}
app.use(log);
//app.use(lights_off);


//Endpoints
app.get('/off', function(req,res) {
    kill_python_process();
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
    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end("success");
});

app.get('/rain', function(req,res) {
    kill_python_process();
    running = true;
    const {PythonShell} = require('python-shell');
    var pyshell = new PythonShell('led_scripts/rain.py');

    pyshell.end(function(err){
    if(err){
        console.log(err);}
    });
    python_process = pyshell.childProcess;

    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end("success");
});

app.get('/dimm', function(req,res) {
    kill_python_process();
    var cmd = "python led_scripts/off.py && python led_scripts/dimm.py"
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
