const temp = require("node-dht-sensor");
const lcd = require('./myLcd.js');
const fan = require('./myFan.js');

lcd.init();

const humitemp = {
    type: 22,
    pin: 21,
    humi: 0.0,
    temp: 0.0,
    str: '',
    ex_humi: 0.0,

    init: (number) => {
        humitemp.pin = number;
        console.log('ì´ˆê¸°?™” pin: ' + humitemp.pin);
    },
    read: () => {
        let humistr = '';
        temp.read(humitemp.type, humitemp.pin, (err, temp, humi) => {
            if (!err) {
                humitemp.temp = temp.toFixed(1);
                humitemp.humi = humi.toFixed(1);
                humistr = humitemp.temp + 'C ' + humitemp.humi + '%';
                console.log(humitemp.temp + 'C ' + humitemp.humi + '%');
                lcd.printSecondLine(humistr)

                if (humitemp.ex_humi < humitemp.humi) {
                    fan.turnOn();
                } else {
                    fan.turnOff();
                }
                humitemp.ex_humi = humitemp.humi;
            }
            else
                console.log(err);
        });
    }
}

module.exports.init = function(number) { humitemp.init(number); };
module.exports.read = function() { humitemp.read(); };