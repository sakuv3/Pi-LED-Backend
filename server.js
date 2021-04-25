const express = require('express');
const net = require('net');

const app = express();
app.use(express.json());

const PORT = 33333

function log(req, res, next) {
  console.log(req.method + ' Request at ' + req.url);
  next();
}
app.use(log);

// convert msg to JSON and send to server
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
});

// error handler
client.on("error", () => {
  console.log("retrying");
  setTimeout(() => {
    client.connect(55555);
  }, 10000);
});


console.log("connecting to server");
client.connect({port: 55555}, () => {
  // Start server
  app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
  });
});

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
app.get('/off/', (req, res) => {
  sendMsg('colorwheel', "000000");
  res.status(200).json({msg: 'off'});
});

app.get('/dimm/', (req, res) => {
  sendMsg('colorwheel', 'ff0032')
  res.status(200).json({msg: 'dimm'});
});

app.get('/rainbow/', (req, res) => {
  sendMsg('rainbow', '0.05')
  res.status(200).json({msg: 'rainbow'});
});

app.get('/rainbow/:speed', (req, res) => {
  let speed = req.params.speed
  console.log(speed)
  sendMsg('rainbow', speed)
  res.status(200).json({msg: 'rainbow'});
});

app.get('/colorwheel/:color', (req, res) => {
  sendMsg('colorwheel', req.params.color)
  res.status(200).json({msg: req.params.color});
})

// ignore favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204);
  res.end();
});
