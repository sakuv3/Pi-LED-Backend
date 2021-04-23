const express = require('express');
const cors = require('cors');
const net = require('net');
const app = express();
const PORT = 33333
app.use(express.json());
app.use(cors());

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
  head = data.length.toString().padEnd(5, ' ');
  client.write(head + data, 'utf8');
}

// socket setup
console.log("creating socket")
let client = new net.Socket();

// connect handler
client.on("connect", () => {
  console.log("connected to server");

  // Start server
  app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
  });
  
});

// error handler
client.on("error", () => {
  console.log("retrying");
  setTimeout(() => {
    client.connect(55555);
  }, 2000);
});


console.log("connecting to server");
client.connect(55555);

// mainpage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/res/index.html');
});

app.get('/app.js', (req, res) => {
  res.sendFile(__dirname + '/res/app.js');
});

app.get('/app.css', (req, res) => {
  res.sendFile(__dirname + '/res/app.css');
});

// Endpoints
app.get('/off/', function(req, res) {
  sendMsg('colorwheel', "000000");
  res.status(200).json({msg: 'off'});
});

app.get('/dimm/', function(req, res) {
  sendMsg('colorwheel', 'ff0032')
  res.status(200).json({msg: 'dimm'});
});

app.get('/rainbow/', function(req, res) {
  sendMsg('rainbow')
  res.status(200).json({msg: 'rainbow'});
});

app.get('/colorwheel/:color', (req, res) => {
  sendMsg('colorwheel', req.params.color)
  res.status(200).json({msg: req.params.color});
})

// ignore favicon
app.get('/favicon.ico', function(req, res) {
  res.status(204);
  res.end();
});
