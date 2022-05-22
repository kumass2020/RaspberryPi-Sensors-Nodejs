const gpio = require('pigpio').Gpio;
const mcpadc = require('mcp-spi-adc');
const SPI_SPEED = 1000000
const LIGHT = 3;

const lightSensor = {
    timerId: 0,
    timeout: 0,
    lightdata: -1,
    lightValue: -1,
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
            console.log("현재 측정된 조도값(%d)", reading.rawValue);
            lightValue = reading.rawValue;
            if (lightValue != -1) {
                lightSensor.webio.sockets.emit('watchLight', lightValue);
                lightValue = -1;
            }
        });
    },
    start: (timerValue) => {
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
module.exports.start = function(timerValue) { lightSensor.start(timerValue);};
module.exports.stop = function() { lightSensor.stop(); };
module.exports.terminate = function() { lightSensor.terminate(); };
