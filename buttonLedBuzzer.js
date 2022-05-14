const gpio = require('pigpio').Gpio;

const BUTTON = 26;
const RED = 16;
const GREEN = 20;
const BLUE = 21;
const BUZZER = 19;

const button = new gpio(BUTTON, { 
	mode:gpio.ALT0,
	pullUpDown: gpio.PUD_UP,
	edge: gpio.FALLING_EDGE
});
const rled = new gpio(RED, { mode:gpio.OUTPUT });
const gled = new gpio(GREEN, { mode:gpio.OUTPUT });
const bled = new gpio(BLUE, { mode:gpio.OUTPUT });
const buzzer = new gpio(BUZZER, { mode:gpio.OUTPUT });

var count = 0;

button.glitchFilter(10000);

const TurnOffBuzzer = () => {
	buzzer.digitalWrite(0);
}

const CheckButton = () => {
	let data;
	data = button.digitalRead();
	if (!data) {
		console.log('Pressed!' + count);
		if((count % 3) == 0) {
			rled.digitalWrite(0);
			gled.digitalWrite(0);
			bled.digitalWrite(1);
			buzzer.digitalWrite(1);
			setTimeout(TurnOffBuzzer, 100);
			count++;
		}
		else if((count % 3) == 1) {
			rled.digitalWrite(1);
			gled.digitalWrite(0);
			bled.digitalWrite(0);
			buzzer.digitalWrite(1);
			buzzer.digitalWrite(1);
			setTimeout(TurnOffBuzzer, 100);
			count++;
		}
		else if((count % 3) == 2) {
			rled.digitalWrite(0);
			gled.digitalWrite(1);
			bled.digitalWrite(0);
			buzzer.digitalWrite(1);
			setTimeout(TurnOffBuzzer, 100);
			count++;
		}
	}
}

process.on('SIGINT', function() {
	rled.digitalWrite(0);
	gled.digitalWrite(0);
	bled.digitalWrite(0);
	buzzer.digitalWrite(0);
	console.log("프로그램을 종료합니다.");
	process.exit();
});
setInterval(CheckButton, 300);

