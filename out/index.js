"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stomp_protocol_1 = require("stomp-protocol");
var net_1 = require("net");
function testServer(socket) {
    var listener = {
        connect: function (headers) {
            console.log('Connect!', headers);
            if (headers && headers.login === 'user' && headers.passcode === 'pass') {
                server.connected({ version: '1.2', server: 'MyServer/1.8.2' }).catch(console.error);
            }
            else {
                server.error({ message: 'Invalid login data' }, 'Invalid login data').catch(console.error);
            }
        },
        send: function (headers, body) {
            console.log('Send!', body, headers);
        },
        subscribe: function (headers) {
            console.log('subscription done to ' + (headers && headers.destination));
        },
        unsubscribe: function (headers) {
            console.log('unsubscribe', headers);
        },
        begin: function (headers) {
            console.log('begin', headers);
        },
        commit: function (headers) {
            console.log('commit', headers);
        },
        abort: function (headers) {
            console.log('abort', headers);
        },
        ack: function (headers) {
            console.log('ack', headers);
        },
        nack: function (headers) {
            console.log('nack', headers);
        },
        disconnect: function (headers) {
            console.log('Disconnect!', headers);
        },
        onProtocolError: function (error) {
            console.log('Protocol error!', error);
        },
        onEnd: function () {
            console.log('End!');
        }
    };
    var server = stomp_protocol_1.createStompServerSession(socket, listener); // 3) Start a STOMP Session over the TCP socket.
}
var server = net_1.createServer(testServer); // 4) Create a TCP server
server.listen(9898, 'localhost'); // 5) Listen for incoming connections
console.log('server connected in: ', 9898);
// var http = require("http");
// var StompServer = require('stomp-broker-js');
// var server = http.createServer();
// var stompServer = new StompServer({server: server});
// server.listen(61614);
// stompServer.subscribe("/**", function(msg, headers) {
//   var topic = headers.destination;
//   console.log(topic, "->", msg);
// });
// stompServer.send('/test', {}, 'testMsg');
// // Node.js socket server script
// const net = require('net');
// // Create a server object
// const server = net.createServer((socket) => {
//   socket.on('data', (data) => {
//     console.log(data.toString());
//   });
//   socket.write('SERVER: Hello! This is server speaking\r\n');
//   socket.end('SERVER: Closing connection now.\r\n');
// }).on('error', (err) => {
//   console.error(err);
// }).on('connect', (data) => {
//     socket.write('SERVER: Hello! This is server speaking\r\n');
//     socket.end('SERVER: Closing connection now.<br>');
// });
// // Open server on port 9898
// server.listen(9898, () => {
//   console.log('opened server on', server.address().port);
// });
// const http = require('http');
// const WebSocketServer = require('websocket').server;
// const server = http.createServer();
// server.listen(9898);
// const wsServer = new WebSocketServer({
//     httpServer: server
// });
// wsServer.on('request', function(request) {
//     const connection = request.accept(null, request.origin);
//     connection.on('message', function(message) {
//       console.log('Received Message:', message.utf8Data);
//       connection.sendUTF('Hi this is WebSocket server!');
//     });
//     connection.on('close', function(reasonCode, description) {
//         console.log('Client has disconnected.', reasonCode, description );
//     });
// });
// server.on('upgrade', (req, socket) => {
//     if(req.headers['upgrade'] !== "websocket"){
//         socket.end('HTTP/1.1 400 Bad Request');
//         return;
//     }
//     const acceptKey = req.headers['sec-websocket-key'];
//     // const acceptHash = generateValue(acceptKey);
//     const acceptHash = acceptKey;
//     let protocols = req.headers['sec-websocket-protocol'];
//     protocols = !protocols ? [] : protocols.split(',').map(name => name.trim());
//     console.log('accepkey', acceptKey, 'hash', acceptHash, 'protocols:', protocols);
//     const resHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${acceptHash}` ];
//     console.log(resHeaders);
//     if(protocols.includes('json')){
//         console.log('json here');
//         resHeaders.push(`Sec-WebSocket-Protocol: json`);
//     }
//     resHeaders.push(`Sec-WebSocket-Protocol: v12.stomp`);
//     socket.write(resHeaders.join('\r\n'));
// })
// function generateValue(key){
//     return crypto
//       .createHash('sha1')
//       .update(key + '258EAFA5-E914–47DA-95CA-C5AB0DC85B11', 'binary')
//       .digest('base64');
// }
// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
// io.on('connection', (socket) => {
//   console.log('a user connected');
// });
// http.listen(3000, () => {
//   console.log('listening on *:3000');
// });
//# sourceMappingURL=index.js.map