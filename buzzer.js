const gpio = require('pigpio').Gpio;
const BUZZER = 21;
const buzzer = new gpio(BUZZER, {mode: gpio.OUTPUT});
var flag = 0;

const TimeOutHandler = () => {
	if (flag > 0) {
		buzzer.digitalWrite(1);
		console.log("Node: BUZZER on");
		flag = 0;
	}
	else {
		buzzer.digitalWrite(0);
		console.log("Node: BUZZER off");
		flag = 1;
	}
}

process.on('SIGINT', () => {
	buzzer.digitalWrite(0);
	console.log("\n부저를 끄고 종료합니다.");
	process.exit();
});

setInterval(TimeOutHandler, 1000);
