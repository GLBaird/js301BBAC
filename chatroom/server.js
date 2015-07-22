// get modules
var http = require("http");
var fs   = require("fs");
var WebSocketServer = require('websocket').server;

function sendFileToResponse(res, fileREF) {
    fs.readFile(__dirname+fileREF, "utf-8", function(err, data) {
        if (err) {
            var msg = "<h1>Server Error 500</h1><p>Cannot read resources.</p>";
            res.writeHead(500, {
                "Content-Size": msg.length,
                "Content-Type": "text/html"
            });
            res.end(msg);
            console.log("Server error 404/500 File did not load: "+fileREF);
        } else {
            res.writeHead(200, {
                "Content-Size": data.length,
                "Content-Type":
                    fileREF == "/public/client.html"
                        ? "text/html"
                        : "text/js"
            });
            res.write(data);
            res.end();

            console.log("File served to client: "+fileREF);
        }
    });
}

// make http server
var server = http.createServer(function(req, res) {
    if (req.url == "/client.js") {
        sendFileToResponse(res, "/public/client.js");
    } else {
        sendFileToResponse(res, "/public/client.html");
    }
});

server.listen(3000, function () {
    console.log("http server runnin on localhost:3000\n");
});

// setup web socket
var wsServer =  new WebSocketServer({
    httpServer: server
});

// data for websockets
var clients = {};
var clientCount = 0;

wsServer.on("request", function(req) {

    var clientID   = parseInt(Date.now()/1000);
    var connection = req.accept("echo-protocol", req.origin);

    // let client know about its ID
    var dataID = JSON.stringify({
        type: "clientID",
        message: clientID
    });

    // let clients know of new user
    var notificiation = JSON.stringify({
        type: "newclient",
        message: clientID
    });
    for (var id in clients) {
        if (clients.hasOwnProperty(id)) {
            clients[id].sendUTF(notificiation);
        }
    }

    // let new client know of exisitng users
    var exisitingClients = [];
    for (var id in clients) {
        if (clients.hasOwnProperty(id)) {
            exisitingClients.push(id);
        }
    }
    var exisitingClientsNotificiation = JSON.stringify({
        type: "clientlist",
        message: exisitingClients
    });
    connection.sendUTF(exisitingClientsNotificiation);


    connection.sendUTF(dataID);

    clients[clientID] = connection;
    clientCount++;

    console.log("New client added: "+clientID+" - total: "+clientCount+" clients.");

    connection.on("message", function(message) {
        console.log("Message from client: "+clientID+"\n\t"+message.utf8Data);

        // parse and process
        var data = JSON.parse(message.utf8Data);

        var responseData;
        if (typeof clients[data.id] != "undefined") {
            responseData = JSON.stringify({
                type: "message",
                clientID: clientID,
                message: data.message
            });
            clients[data.id].sendUTF(responseData);
        } else {
            // client has been removed
            console.log("Error - message for "+data.id+" with unkown client");
            responseData = JSON.stringify({
                type: "error",
                message: "client not found"
            });
            connection.sendUTF(responseData);
        }
    });

    connection.on("close", function(reason, desc) {
        console.log("Client has left "+clientID+" for reason: "+reason+", "+desc);

        // remove client
        delete clients[clientID];
        clientCount--;

        // pass on to other clients
        var notificiation = JSON.stringify({
            type: "clientleft",
            message: clientID
        });
        for (var id in clients) {
            if (clients.hasOwnProperty(id)) {
                clients[id].sendUTF(notificiation);
            }
        }
    });

});

















