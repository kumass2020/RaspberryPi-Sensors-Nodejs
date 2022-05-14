const humitemp = require('./myHt.js');
const HTPIN = 21;

humitemp.init(HTPIN);

console.log("======================================");
console.log("      5초간격으로 온도와 습도를 측정합니다     ");
console.log("======================================");

setInterval( () => { humitemp.read(); }, 5000);
