const humitemp = require('./myHt.js');
const HTPIN = 21;

humitemp.init(HTPIN);

console.log("======================================");
console.log("      5ì´ˆê°„ê²©ìœ¼ë¡? ?˜¨?„??? ?Šµ?„ë¥? ì¸¡ì •?•©?‹ˆ?‹¤     ");
console.log("======================================");

humi = setInterval( () => { humitemp.read(); }, 5000);

process.on('SIGINT', function () {
    clearInterval(humi);
    console.log("terminating...");
    process.exit();
});