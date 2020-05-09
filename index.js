const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
const PORT = 9898
server.listen(PORT);
const wsServer = new WebSocketServer({ httpServer: server });

const topics = ['messages','server/status'];
let subscriptions = [ 'jorge']
let msgId = 0
let messages = [
    'Hello, from WS SERVER',
    // 'This is Excelent!',
    // 'another message from WS',
    // 'this service is working',
    // 'works great',
    // 'this message is coming?',
    // 'please send me to client',
    '{"status":"offline"}',
    '{"status":"online"}',
]


wsServer.on('request', function(request) {

    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
        let msgObj = txt2Msg(message.utf8Data) 
        console.log( 'RECEIVED: ', msgObj )
        if (msgObj.command == 'SUBSCRIBE') {
            subscriptions.push( msgObj.id )
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.', reasonCode, description );
    });

    onTimeout( function(){
        let msgRandom = buildRandomMsg()
        console.log( 'SENT: ', msgRandom )
        let msgTxt = msg2Text(msgRandom)
        connection.send( msgTxt );
    } )

});


function txt2Msg(txt){
    let lines = txt.split('\n');
    let parsedMsg = { body: [] }
    let isBody;
    lines.forEach( (currLine, idx) => {
        if (isBody) {
            parsedMsg.body.push (currLine)
        } else if (idx == 0) {
            parsedMsg.command = currLine
        } else {
            let keyValue = currLine.split(':')
            if (keyValue.length == 2) {
                parsedMsg[keyValue[0]] = keyValue[1]
            } 
        }
        isBody = currLine.length == 0
        // return keyValue.length ==2 ? { key: keyValue[0] , value: keyValue[1]  } : { value: keyValue[0]  }
    })
    parsedMsg.body = parsedMsg.body.join('\n')
    return parsedMsg
}


function buildRandomMsg(){
    let msg = {}
    msg['command'] = 'MESSAGE'
    msg['body'] = getRandomItem(messages)
    msg['content-length'] = msg.body.length
    msg['message-id'] = ++msgId
    msg['subscription'] = getRandomItem(subscriptions)
    msg['destination'] = getRandomItem(topics)
    msg['priority'] = getRandomNumber( 9 )
    return msg;
}


function onTimeout( callback, max ){
    var counter = typeof max == 'undefined' ? 50 : max;
    function loop( myFunction ){
        counter--;
        if (counter > 0) {
            myFunction()
            setTimeout(function(){
                loop( myFunction )
            }, 1000);    
        }
    }
    loop(callback)
}


function msg2Text( msg ){
    let msgArr = []
    msgArr.push('\n' + msg.command)
    let keys = Object.keys(msg)
    keys.forEach( (currKey, idx) => { 
        if (currKey != 'command' && currKey != 'body' ){
            let newLine = `${currKey}:${msg[currKey]}`
            msgArr.push(newLine)
        }
    })
    msgArr.push('\n'+ msg.body )
    return msgArr.join('\n')
}


function getRandomNumber( max ){
    return Math.floor(Math.random() * max) + 1
}


function getRandomItem( list ){
    return list[Math.floor(Math.random() * list.length)]
}