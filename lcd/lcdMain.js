const network = require('network');
const lcd = require('./lcd.js');

lcd.init();

network.get_active_interface((err, ifaces) => {
    if (ifaces !== undefined) {
        if (ifaces.name == 'wlan0') {
            console.log('라즈베리파이 IP주소: ' + ifaces.ip_address);
            lcd.printMessage('Computer Gachon ', ifaces.ip_address);
        }
    }
});