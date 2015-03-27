
var http = require('http');
var server = http.createServer(function(request, response){});

server.listen(1234, function(){
    console.log((new Date() + ' Server is listening on port 1234'));
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

var count = 0;
var clients = {};

wsServer.on('request', function(r){
    // Code here to run on connection
    var connection = r.accept('echo-protocol', r.origin);

    // Create ID for this client and Increment count
    var id = count++;

    // Store the connection method so we can loop through and contact all clients
    clients[id] = connection;

    console.log((new Date()) + ' Connection accepted [' + id + ']');

    connection.on('message', function(message){
        // the string message that was sent to us
        if(message.type === 'utf8'){

            var msgString = message.utf8Data;
            console.log((new Date()) + ' message aquired: ' + msgString);

            // Loop through all clients
            for(var i in clients){
                clients[i].sendUTF(msgString);
            }
        }

    });

    connection.on('close', function(reasonCode, descritpion){
        delete clients[id];
        console.log((new Date()) + 'Peer' + connection.remoteAddress + ' disconnected.');
    });

});
