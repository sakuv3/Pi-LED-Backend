const express = require('express');
const cors = require('cors');
const fs = require('fs');
const net = require('net');
const {json} = require('express');
const {send} = require('process');
const app = express();
const PORT = 33333
app.use(express.json());
app.use(cors());

// Middleware
let pyshell;
let options = {
  pythonPath: '/usr/bin/python2.7',
  pythonOptions: ['-u'],  // get print results in real-time
  scriptPath: 'led_scripts/',
  args: 0.01
};
let running = false;

function log(req, res, next) {
  console.log(req.method + ' Request at ' + req.url);
  next();
}
app.use(log);

function sendMsg(msg, args = '') {
  let obj = new Object();
  obj.type = msg;
  obj.args = args;
  data = JSON.stringify(obj);
  // generate header with predefined length
  // a single message containing the number of bytes, padded to length = 5
  head = data.length.toString().padEnd(5, " ");
  console.log("data length: " + head);
  console.log("data: " + data);
  client.write(head, "utf8");
  client.write(data, "utf8");
  
}

const client = net.createConnection({port: 55555});

// mainpage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/app.js', (req, res) => {
  res.sendFile(__dirname + '/app.js');
});

app.get('/app.css', (req, res) => {
  res.sendFile(__dirname + '/app.css');
});

// Endpoints
app.get('/off/', function(req, res) {
  sendMsg("colorwheel", "000000");
  res.status(200).json({msg: 'off'});
});

app.get('/dimm/', function(req, res) {
  sendMsg("colorwheel", "ff0032")
  res.status(200).json({msg: 'dimm'});
});

app.get('/rainbow/', function(req, res) {
  sendMsg("rainbow")
  res.status(200).json({msg: 'rainbow'});
});

app.get('/colorwheel/:color', (req, res) => {
  sendMsg("colorwheel", req.params.color)
  res.status(200).json({msg: req.params.color});
})

app.get('/test/', function(req, res) {
  fs.readFile(filename, 'utf8', function(err, data) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
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
