const gpio = require('pigpio').Gpio;

const LIGHT = 4;
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
const light = new gpio(LIGHT, { mode:gpio.ALT0 });
const rled = new gpio(RED, { mode:gpio.OUTPUT });
const gled = new gpio(GREEN, { mode:gpio.OUTPUT });
const bled = new gpio(BLUE, { mode:gpio.OUTPUT });
const buzzer = new gpio(BUZZER, { mode:gpio.OUTPUT });

const TurnOffBuzzer = () => {
	buzzer.digitalWrite(0);
}

const CheckLight = function() {
    rled.digitalWrite(0);
    gled.digitalWrite(0);
    bled.digitalWrite(0);
    let data = light.digitalRead();
    console.log(data);
    if(!data) {
        console.log("밝음, LED off");
        rled.digitalWrite(0);
        gled.digitalWrite(0);
        bled.digitalWrite(0);
    }
    else {
        console.log("어두움, LED on");
        rled.digitalWrite(1);
        gled.digitalWrite(1);
        bled.digitalWrite(1);
        
        let data;
        data = button.digitalRead();
        if(!data) {
            console.log('버튼이 눌렸습니다');
            buzzer.digitalWrite(1);
			setTimeout(TurnOffBuzzer, 100);
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
setInterval(CheckLight, 300);