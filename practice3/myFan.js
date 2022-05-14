const gpio = require('pigpio').Gpio;
const RELAY = 26;
const relay = new gpio(RELAY, { mode:gpio.OUTPUT });

const Relay = {
    turnOn: () => {
        relay.digitalWrite(1);
        console.log("Nodejs: RELAY on");
    },
    turnOff: () => {
        relay.digitalWrite(0);
        console.log("Nodejs: RELAY off");
    }
}

module.exports.turnOn = function () { Relay.turnOn(); };
module.exports.turnOff = function () { Relay.turnOff(); };