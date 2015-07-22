var app = {

    // networking
    ws: null,
    identifier: null,
    clientIdentifier: null,

    // UI outlets
    clientList: null,
    log: null,
    inputText: null,

    run: function() {

        // get UI outlets
        this.log = document.getElementById("textLog");
        this.inputText = document.getElementById("chatText");
        this.clientList = document.getElementById("clientList");

        // add event listeners
        document.forms[0].addEventListener("submit", this.submitDataHandler.bind(this), false);
        this.clientList.addEventListener("change", this.changeClientHandler.bind(this), false);

        this.setupWebSocket();
    },

    setupWebSocket: function() {
        this.ws = new WebSocket(window.location.href.replace("http", "ws"), "echo-protocol");
        this.ws.addEventListener("message", this.incomingData.bind(this), false);
    },

    /**
     * Form submitted event
     * @param e {Event}
     */
    submitDataHandler: function(e) {
        e.preventDefault();
        var txt = this.inputText.value;
        this.ui.addTextToLogClient(txt);
        this.inputText.value = "";

        // send through socket
        var message = JSON.stringify({
            id: this.clientIdentifier,
            message: txt
        });
        this.ws.send(message);
    },

    /**
     * Called when the SELECT element has changed,
     * should update the client to send message
     * @param e {Event}
     */
    updateClientIdentifier: function() {
        document.getElementById("identifier").innerHTML = this.identifier;
    },

    /**
     * Called when the client list has been updated server side
     * @param type {string}  "new"|"remove"
     * @param id {string} id of client to add or remove
     */
    updateClientList: function(type, id) {
        if (type == "new") {
            var option = document.createElement("option");
            option.setAttribute("value", id);
            option.appendChild(
                document.createTextNode(id)
            );
            this.clientList.appendChild(option);
            this.ui.addTextToLogSocket("<i>*** NEW CLIENT "+id+" has joined the chat</i>");

            if (this.clientIdentifier == null) {
                this.clientIdentifier = id;
            }
        } else if (type == "left") {
            var options = this.clientList.getElementsByTagName("option");
            for (var i=0; i< options.length; i++) {
                if (options[i].value == id) {
                    this.clientList.removeChild(options[i]);
                    this.ui.addTextToLogSocket("<i>*** "+id+" has left the chat</i>");
                }
            }
        } else if (type == "init") {
            for (var i in id) {
                this.updateClientList("new", id[i]);
            }
        }
    },

    changeClientHandler: function(e) {
        this.clientIdentifier = e.target.value;
        this.ui.addTextToLogClient("<i>*** Changed client to "+this.clientIdentifier+"</i>");
    },

    /**
     * Called when the socket is inputing data
     * @param e {Event} string data for UI
     */
    incomingData: function(e) {
        // check data
        var data = JSON.parse(e.data);
        switch (data.type) {
            case "clientID":
                this.identifier = data.message;
                this.updateClientIdentifier();
                this.ui.addTextToLogClient("You have joined the chat as "+this.identifier);
                break;
            case "newclient":
                this.updateClientList("new", data.message);
                break;
            case "clientlist":
                this.updateClientList("init", data.message);
                break;
            case "message":
                this.ui.addTextToLogSocket("<b>"+data.clientID+"</b>: "+data.message);
                break;
            case "error":
                this.ui.addTextToLogError("ERROR! "+data.message);
                break;
            case "clientleft":
                this.updateClientList("left", data.message);
                break;
        }
    },

    /**
     * UI Methods for displaying text
     */
    ui: {
        addTextToLogClient: function(txt) {
            app.log.innerHTML += "<span class='client'>"+txt+"</span>\n";
        },

        addTextToLogSocket: function(txt) {
            app.log.innerHTML += "<span class='socket'>"+txt+"</span>\n";
        },

        addTextToLogError: function(txt) {
            app.log.innerHTML += "<span class='error'>"+txt+"</span>\n";
        }
    }

}