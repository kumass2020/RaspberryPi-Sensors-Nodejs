const gpio = require('pigpio').Gpio;
const RELAY = 26;
const relay = new gpio(RELAY, { mode:gpio.OUTPUT });

const Relay = {
    turnOn: () => {
        
    }

    turnOff:
}