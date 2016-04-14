 var app = require('http').createServer(handler)
 var fs = require('fs');

 var i2c = require('i2c-bus');
 var MPU6050 = require('i2c-mpu6050');

 var address = 0x68;
 var i2c1 = i2c.openSync(1);

 var sensor = new MPU6050(i2c1, address);

 var data = sensor.readSync();

 var port = (process.argv[2] ? Number(process.argv[2]) : 3000);
 app.listen(port);
 console.log("listening on port ", port);

 function handler(req, res) {
     data = sensor.readSync();
     console.log(data);
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.writeHead(200);
     data = data.temp.toString();
     res.end(data);
 }
