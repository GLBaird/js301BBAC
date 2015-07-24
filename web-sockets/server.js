// import modules
var http = require("http");
var fs = require("fs");
var WebSocketServer = require('websocket').server;

// create server
var server = http.createServer(function(req, res) {
    var htmlFile = fs.readFileSync("client.html");

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    
    // send html file
    res.write(htmlFile);
    res.end();
    
});

server.listen(3000, function() {
    console.log("Server is running on http://localhost:3000");
});

// create websocket server
var wsServer = new WebSocketServer({ httpServer: server} );

wsServer.on('request', function(request) {
    console.log("Request for websocket");
    
    var connection = request.accept('echo-protocol', request.origin);
    connection.sendUTF("Connection open");
    
    connection.on('message', function(message) {
        console.log("Message: "+message.utf8Data);
        
        connection.sendUTF("Your message has been received");
    });
    
    connection.on('close', function() {
        console.log("Socket connection closed.");
    });
});

