const gpio = require('pigpio').Gpio;
const LIGHT = 4;
const LED = 26;
const light = new gpio(LIGHT, { mode:gpio.ALT0 });
const led = new gpio(LED, { mode:gpio.OUTPUT });

const CheckLight = function() {
	led.digitalWrite(0);
	let data = light.digitalRead();
	console.log(data);
	if(!data) {
		console.log("bright!, LED off");
		led.digitalWrite(0);
	}
	else {
		console.log("dark!, LED on");
		led.digitalWrite(1);
	}
}

process.on('SIGINT', function() {
	led.digitalWrite(0);
	console.log("program terminating...");
	process.exit();
});

setInterval(CheckLight, 100);
