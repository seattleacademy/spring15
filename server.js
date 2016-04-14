 var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var i2c = require('i2c-bus');
var MPU6050 = require('i2c-mpu6050');

var address = 0x68;
var i2c1 = i2c.openSync(1);

var sensor = new MPU6050(i2c1, address);

var data = sensor.readSync();
//console.log(data);
var counter = 0;
var pageName = "index.html";

//if port not given use this as default
var port = (process.argv[2] ? Number(process.argv[2]) : 3000);
app.listen(port);
console.log("listening on port ", port);

function handler(req, res) {
    fs.readFile(__dirname + '/' + pageName, processFile);

    function processFile(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + pageName);
        }
        res.writeHead(200);
        res.end(data);
    }
}


io.on('connection', onConnect);
function getUptime(){
    return process.uptime();
}

function getUptime(){
    return process.uptime();
}

function onConnect(socket) {
    console.log('connected');
    socket.on('readSensor', function(data) {
        //console.log(data);
        data = sensor.readSync();
        counter++;
        data.counter = counter;
        data.uptime = getUptime();
        io.sockets.emit('sensordata', data);
    });
}
