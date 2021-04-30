const express = require('express');
const net = require('net');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/res"));


const HTTP_PORT = 33333
const LED_SERVER_PORT = 55555;

function log(req, res, next) {
  console.log(req.method + ' Request at ' + req.url);
  next();
}
app.use(log);

//  -- Helper Functions --
//#region 

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
//#endregion

// socket setup
//#region
let CONNECTION_STATUS = false;
console.log("creating socket")
let client = new net.Socket();

// connect handler
client.on("connect", () => {
  CONNECTION_STATUS = true;
  console.log("connected to LED control server");
});

// error handler
client.on("error", () => {
  CONNECTION_STATUS = false;
  console.log("retrying");
  setTimeout(() => {
    client.connect({port: LED_SERVER_PORT});
  }, 10000);
});

// connect to LED control server
console.log("connecting to LED control server");
client.connect({port: LED_SERVER_PORT});
//#endregion

// start http server
app.listen(HTTP_PORT, () => {
  console.log('http server listening on port ' + HTTP_PORT);
});

//  -- GET REQUESTS --
//#region

// requests for Event streams
app.get('/status', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client
});

// mainpage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/res/index.html');
});

// app.get('/app.js', (req, res) => {
//   res.sendFile(__dirname + '/res/app.js');
// });

// app.get('/app.css', (req, res) => {
//   res.sendFile(__dirname + '/res/app.css');
// });

// Endpoints
app.get('/off/', (req, res) => {
  sendMsg('colorwheel', "000000");
  res.status(200).json({"msg": 'off'});
});

app.get('/dimm/', (req, res) => {
  sendMsg('colorwheel', 'ff0032')
  res.status(200).json({"msg": 'dimm'});
});

app.get('/rainbow/', (req, res) => {
  sendMsg('rainbow', '0.05')
  res.status(200).json({"msg": 'rainbow'});
});

app.get('/rainbow/:speed', (req, res) => {
  let speed = req.params.speed;
  sendMsg('rainbow', speed)
  res.status(200).json({"msg": 'rainbow'});
});

app.get('/colorwheel/:color', (req, res) => {
  sendMsg('colorwheel', req.params.color)
  res.status(200).json({"msg": req.params.color});
})

// ignore favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204);
  res.end();
});
//#endregion
