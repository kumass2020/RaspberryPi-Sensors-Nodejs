const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD(1, 0x27, 16, 2);

function wait(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}

const Lcd = {
    message: ['Line1', 'Line2'],
    init: () => {
        console.log('LCD모듈을 초기화합니다');
        lcd.beginSync();
        lcd.clearSync();
    },
    printMessage: (str) => {
        lcd.clearSync();
        if (str.length <= 16) {
            lcd.setCursorSync(0, 0);
            lcd.printSync(str);
            lcd.setCursorSync(0, 1);
            lcd.printSync('');
        } else if (str.length <= 32) {
            lcd.setCursorSync(0, 0);
            lcd.printSync(str.substr(0, 16));
            lcd.setCursorSync(0, 1);
            lcd.printSync(str.substr(16, 32));
        } else {
            for (var i = 0; i < str.length / 2 - 16; i++){
                lcd.setCursorSync(0, 0);
                if (i % 2 == 1) {
                    lcd.printSync(str.substr(str.length / 2 - 16 - i, str.length / 2 - i));
                } else {
                    lcd.printSync(str.substr(str.length / 2 - 15 - i, str.length / 2 - i + 1));
                }
                lcd.setCursorSync(0, 1);
                lcd.printSync(str.substr(str.length - 15 - i, str.length - i + 1));
                wait(1);
            }
        }
    },
    clear: () => {
        lcd.clearSync();
    }
};

module.exports.init = function () { Lcd.init(); };
module.exports.printMessage = function (str) { Lcd.printMessage(str); };
module.exports.clear = function () { Lcd.clear(); };