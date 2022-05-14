const gpio = require('pigpio').Gpio;

const rled = new gpio(20, {mode: gpio.ALT0});
const bled = new gpio(16, {mode: gpio.ALT0});
const button = new gpio(21, {
	mode: gpio.INPUT,
	pullUpDown: gpio.PUD_UP,
	edge: gpio.FALLING_EDGE
});
var count = 0;

button.glitchFilter(10000);

const Handler = (level, tick) => {
	if(level === 0) {
		console.log(++count + ' Button down ' + tick);
		rled.digitalWrite(1);
		bled.digitalWrite(0);
	}
	else {
		console.log(++count + ' Button up' + tick);
		rled.digitalWrite(0);
		bled.digitalWrite(1);
	}
}

button.on('interrupt', Handler);

process.on('SIGINT', function() {
	rled.digitalWrite(0);
	bled.digitalWrite(0);
	console.log("program terminating...");
	process.exit();
});
