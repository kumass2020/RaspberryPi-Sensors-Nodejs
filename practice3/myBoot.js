const network = require('network');
const lcd = require('./myLcd.js');

lcd.init();

network.get_active_interface((err, ifaces) => {
    if (ifaces !== undefined) {
        if (ifaces.name == 'wlan0') {
            console.log(ifaces.ip_address, '201935256');
            lcd.printMessage(ifaces.ip_address, '201935256');
        }
    }
});