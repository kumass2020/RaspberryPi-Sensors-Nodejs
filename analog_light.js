const gpio = require('pigpio').Gpio;
const mcpadc = require('mcp-spi-adc');

const CS_MCP3208 = 10
const SPI_SPEED = 1000000
const LIGHT = 0
const LED = 26

const led = new gpio(LED, {mode: gpio.OUTPUT});

var timerid, timeout = 200;
var lightdata = -1;

const Light = mcpadc.openMcp3208(LIGHT,
    {speedHz: SPI_SPEED},
    (err) => {
        console.log("SPI 채널0 초기화완료!");
        console.log("------------------");
        if (err) console.log('채널0 초기화실패!(HW점검!)');
    });

const AnalogLight = () => {
    Light.read((error, reading) => {
        console.log(" 현재 측정된 조도값(%d)", reading.rawValue);
        lightdata = reading.rawValue;
    });
    if (lightdata != -1) {
        if (lightdata > 1300)
            led.pwmWrite(250);
        else if(lightdata < 500)
            led.pwmWrite(1);
        else
            led.pwmWrite(30);
        lightdata = -1;
    }
    timerid = setTimeout(AnalogLight, timeout);
}

process.on('SIGINT', () => {
    Light.close(() => {
        console.log("MCP-ADC가 해제되어, 프록램을 종료합니다");
        led.pwmWrite(0);
        process.exit();
    });
});

console.log("---------------------------------------------");
console.log("전등을 끄거나 켜서 밝기를 변화시켜보면서 프로그램을 확인하세요");
console.log("---------------------------------------------");
setImmediate(AnalogLight);