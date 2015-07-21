
(function(window, $) {

    var app = {
        
        username: null,
        
        socket: null,
        
        init: function() {
            // code
            this.username = "Bob";
            this.setupSockets()
            this.ui.init();
        },
        
        setupSockets: function() {
            
        },
        
        ui: {
            
            init: function() {
                
            },
            
            addItem: function(e) {
                
            }
            
        },
        
        network: {
            
            sendData: function() {
                
            }
            
        }
        
    }
    
    app.init();
    
    window.stuff = app; 

})(window, $);