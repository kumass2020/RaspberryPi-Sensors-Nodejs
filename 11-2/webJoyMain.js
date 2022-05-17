const http = require('http');
const fs = require('fs');
const network = require('network');
const socketio = require('socket.io');
const mcpadc = require('mcp-spi-adc');
const joystick = require('./sensors/joystick.js');
const PORT = 65001;

const serverbody = (request, response) => {
    fs.readFile('views/chart.html', 'utf8', (err, data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
        console.log("웹페이지에 접속하였습니다");
    });
};

const server = http.createServer(serverbody);
const io = require('socket.io')(server);

joystick.init(io);

io.on('connection', client => {
    client.on('startmsg', function (data) {
        console.log('가동메시지 수신(측정주기:%d)!', data);
        timeout = data;
        joystick.start(data);
    });

    client.on('stopmsg', function (data) {
        console.log('중지메시지 수신!');
        joystick.stop();
    })
})