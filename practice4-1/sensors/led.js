const gpio = require('pigpio').Gpio;
const LED = 21;
const led = new gpio(LED, { mode:gpio.OUTPUT });

const Led = {
    turnOn: () => {
        led.digitalWrite(1);
        console.log("Nodejs: Green LED on");
    },
    turnOff: () => {
        led.digitalWrite(0);
        console.log("Nodejs: Green LED off");
    }
}

module.exports.turnOn = function () { Led.turnOn(); };
module.exports.turnOff = function () { Led.turnOff(); };