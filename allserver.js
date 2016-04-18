 var app = require('http').createServer(handler)
 var fs = require('fs');

 var i2c = require('i2c-bus');
 var MPU6050 = require('i2c-mpu6050');

 var address = 0x68;
 var i2c1 = i2c.openSync(1);

 var sensor = new MPU6050(i2c1, address);

 var data = sensor.readSync();
 sensor.calibrateGyro({x:-data.gyro.x,y:-data.gyro.y,z:-data.gyro.z} );
 sensor.calibrateAccel({x:-data.accel.x,y:-data.accel.y,z:-data.accel.z+1} );
 data = sensor.readSync();
 console.log(data);
 var port = (process.argv[2] ? Number(process.argv[2]) : 3000);
 app.listen(port);
 console.log("listening on port ", port);

 function handler(req, res) {
     //console.log(req);
     data = sensor.readSync();
     //console.log(data);
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.writeHead(200);
     reply = data.gyro.x.toString() + "\n";
     reply += data.gyro.y.toString() + "\n";
     reply += data.gyro.z.toString() + "\n";
     reply += data.accel.x.toString() + "\n";
     reply += data.accel.y.toString() + "\n";
     reply += data.accel.z.toString() + "\n";
     reply += data.rotation.x.toString() + "\n";
     reply += data.rotation.y.toString() + "\n";
     reply += data.rotation.z.toString() + "\n";
     reply += data.temp.toString();
     res.end(reply);
 }
