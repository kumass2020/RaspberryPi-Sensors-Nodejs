const humitemp = require('./myHt.js');
const HTPIN = 21;

humitemp.init(HTPIN);

console.log("======================================");
console.log("      5초간격으�? ?��?��??? ?��?���? 측정?��?��?��     ");
console.log("======================================");

humi = setInterval( () => { humitemp.read(); }, 5000);

process.on('SIGINT', function () {
    clearInterval(humi);
    console.log("terminating...");
    process.exit();
});