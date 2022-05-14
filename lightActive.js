const gpio = require('pigpio').Gpio;

// 터치센서 사용 조건 없음
// const TOUCH = 13;
const LIGHT = 4;
const BUTTON = 26;
const RED = 16;
const GREEN = 20;
const BLUE = 21;
const BUZZER = 19;

// const touch = new gpio(TOUCH, { mode:gpio.ALT0 });
const button = new gpio(BUTTON, { 
	mode:gpio.ALT0,
	pullUpDown: gpio.PUD_UP,
	edge: gpio.FALLING_EDGE
});
const light = new gpio(LIGHT, { mode:gpio.ALT0 });
const rled = new gpio(RED, { mode:gpio.OUTPUT });
const gled = new gpio(GREEN, { mode:gpio.OUTPUT });
const bled = new gpio(BLUE, { mode:gpio.OUTPUT });
const buzzer = new gpio(BUZZER, { mode:gpio.OUTPUT });

const TurnOffBuzzer = () => {
	buzzer.digitalWrite(0);
}

let flag = 0;
let count = 0;

button.glitchFilter(10000);

const CheckLight = () => {
    let lightData = light.digitalRead();
    if(!lightData) {
        console.log('밝음');
        if (flag == 1) {
            buzzer.digitalWrite(1);
            setTimeout(TurnOffBuzzer, 100);
        }
        flag = 0;
    } else {
        console.log('어두움');
        if (flag == 0) {
            buzzer.digitalWrite(1);
            setTimeout(TurnOffBuzzer, 100);
        }
        flag = 1;
    }
}

const CheckButton = () => {
	let data;
	data = button.digitalRead();
	if (!data) {
		console.log('Pressed!' + count);
		if((count % 2) == 0) {
            console.log('red on');
			rled.digitalWrite(1);
			gled.digitalWrite(0);
			bled.digitalWrite(0);
			count++;
		}
		else if((count % 2) == 1) {
            console.log('blue on');
			rled.digitalWrite(0);
			gled.digitalWrite(0);
			bled.digitalWrite(1);
			count++;
		}
	}
    else {
        if((count % 2) == 1) {
            setImmediate(CheckLight);
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