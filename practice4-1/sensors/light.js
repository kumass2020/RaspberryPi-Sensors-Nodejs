const gpio = require('pigpio').Gpio;
const mcpadc = require('mcp-spi-adc');
const SPI_SPEED = 1000000
const LIGHT = 3;
const led = require('./led.js');

const lightSensor = {
    timerId: 0,
    timeout: 0,
    lightdata: -1,
    lightValue: -1,
    limitValue: 0,
    init: (io) => {
        lightSensor.lightdata = mcpadc.openMcp3208(LIGHT,
            {speedHz: SPI_SPEED},
            (err) => {
                console.log("SPI 채널3 초기화완료!");
                console.log("------------------");
                if (err) console.log('채널3 초기화실패!(HW점검!)');
            });
        lightSensor.webio = io;
    },
    read: () => {
        // let lightValue = -1;
        lightSensor.lightdata.read((error, reading) => {
            lightSensor.lightValue = reading.rawValue;
            console.log("현재 측정된 조도값(%d), 기준값(%d)", parseInt(lightSensor.lightValue), parseInt(lightSensor.limitValue));
            // console.log(typeof lightSensor.lightValue, typeof parseInt(lightSensor.limitValue));
            if ( parseInt(lightSensor.lightValue) < parseInt(lightSensor.limitValue) ) {
                led.turnOn();
            } else {
                led.turnOff();
            }
            if (lightSensor.lightValue != -1) {
                lightSensor.webio.sockets.emit('watchLight', lightSensor.lightValue);
                lightSensor.lightValue = -1;
            }
        });
    },
    start: (timerValue, limit) => {
        lightSensor.limitValue = limit;
        if (lightSensor.timerId == 0) {
            lightSensor.timerId = setInterval(lightSensor.read, timerValue);
        }
        else { console.log("조도센서/이미 가동중입니다......."); }
    },
    stop: () => {
        if (lightSensor.timerId != 0) {
            clearInterval(lightSensor.timerId);
            lightSensor.timerId = 0;
        }
    },
    terminate: () => {
        lightSensor.lightdata.close(() => {
            console.log('MCP-ADC를 해제하고, 웹서버를 종료합니다.')
            process.exit();
        });
    }
};

module.exports.init = function(io) { lightSensor.init(io); };
module.exports.read = function() { lightSensor.read(); };
module.exports.start = function(timerValue, limit) { lightSensor.start(timerValue, limit);};
module.exports.stop = function() { lightSensor.stop(); };
module.exports.terminate = function() { lightSensor.terminate(); };
