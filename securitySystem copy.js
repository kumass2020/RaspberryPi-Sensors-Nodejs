const gpio = require('pigpio').Gpio;

const TRIG = 6;
const ECHO = 13;
const TOUCH = 15;
const LED = 16;
// const BUZZER = 19;
const RELAY = 26;
const relay = new gpio(RELAY, { mode:gpio.OUTPUT });

const button = new gpio(21, {
	mode: gpio.INPUT,
	pullUpDown: gpio.PUD_UP,
	edge: gpio.FALLING_EDGE
});
const led = new gpio(LED, {mode: gpio.OUTPUT});
const trig = new gpio(TRIG, {mode: gpio.OUTPUT});
const echo = new gpio(ECHO, {mode: gpio.INPUT, alert: true});
const touch = new gpio(TOUCH, { mode:gpio.ALT0 });
// const buzzer = new gpio(BUZZER, { mode:gpio.OUTPUT });

let buttonCount = 0;

button.glitchFilter(10000);

// const TurnOffBuzzer = () => {
// 	buzzer.digitalWrite(0);
// }

const TurnOnSwitch = () => {
	relay.digitalWrite(1);
	console.log("Nodejs: RELAY on");
}

const TurnOffSwitch = () => {
	relay.digitalWrite(0);
	console.log("Nodejs: RELAY off");
}

trig.digitalWrite(0);

const GetDistance = (level, tick) => {
    console.log(level, tick);
    let startTick, distance, diff;
    if(level == 1) { startTick = tick; }
    else{
        const endTick = tick;
        diff = endTick - startTick;
        distance = diff / 58;
        if (distance < 100) {
            console.log("근접거리: %i cm", distance);
            PWMled(distance);
        }
    }
}

const Triggering = () => {
    echo.on('alert', GetDistance);
};

const CheckLight = () => {
	let data = touch.digitalRead();
	// console.log(data);
	if(data) {
		console.log("touch!!");
		relay.digitalWrite(0);
	}
}

const PWMled = (dis) => {
    if (dis<5) led.pwmWrite(255);
    else if (dis >= 5 && dis < 10) led.pwmWrite(150);
    else if (dis >= 10 && dis < 20) led.pwmWrite(50);
    else if (dis >= 20) led.pwmWrite(0);
    else led.pwmWrite(0);

    if (dis<=10) {
        setImmediate(TurnOnSwitch);
        setInterval(CheckLight, 300);
    } else if (dis > 10) {
        setImmediate(TurnOffSwitch);
    }
}

process.on('SIGINT', () => {
    led.digitalWrite(0);
    relay.digitalWrite(0);
    console.log("프로그램을 종료합니다.");
    process.exit();
});

console.log("--------------------------------");

const Trigger = () => {
    trig.trigger(10, 1);
}

const Handler = (level, tick) => {
    if (level === 0) {
        console.log(++buttonCount + ' Button down ' + tick);
    }

	if ( buttonCount % 2 == 1 ) {
        Triggering();   
        setInterval(Trigger, 150);
	} else if ( buttonCount % 2 == 0 ) {
        clearInterval(Trigger);
        clearInterval(CheckLight);
        echo.removeListener('alert', GetDistance);
    }
}

button.on('interrupt', Handler);