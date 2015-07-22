
var PanelViewMoments = "momentsView";
var PanelViewUpload  = "uploadView";
var PanelViewLogon   = "logonView";

var app = {
    
    init: function() {
        this.ui.init();
    },
    
    ui: {
        
        init: function() {
            $("nav").click(this.toolbarClicked.bind(this));
            
            // initialise view controllers
            this.viewControllers.logonPanel.init();
        },
        
        toolbarClicked: function(e) {
            if (e.target.nodeName == "A") {
                e.preventDefault();
                switch (e.target.id) {
                    case "moments":
                        this.showPanel(PanelViewMoments);
                        break;
                    case "logon":
                        this.showPanel(PanelViewLogon);
                        break;
                    case "upload":
                        this.showPanel(PanelViewUpload);
                        break;
                }
            }
        },
        
        showPanel: function(panel) {
            $("section").addClass("hidden");
            $("#"+panel).removeClass("hidden");
        },
        
        viewControllers: {
            
            momentsList: {
                
                
                
            },
            
            uploadPanel: {
                
                
            },
            
            logonPanel: {
                
                mode: "logon",
                
                init: function() {
                    
                    $("input[name='logonType']")
                        .click(this.radioButtonClicked.bind(this));
                    
                    $("form#logonForm")
                        .submit(this.formSubmitted.bind(this));
                    
                    $("input#confirm").hide();
                    
                },
                
                radioButtonClicked: function(e) {
                    this.mode = e.target.getAttribute("value");
                    if (this.mode == "new") {
                        $("input#confirm").show();
                    } else {
                        $("input#confirm").hide();
                    }
                  
                },
                
                formSubmitted: function(e) {
                    e.preventDefault();
                    var data = {
                        username: $("#username").val(),
                        password: $("#password").val(),
                        type: this.mode
                    }
                    
                    if (this.mode == "new"
                         && data.password != $("#confirm").val()) {
                        alert("Password should match!");
                        return;
                    }
                    
                    $.ajax({
                        url: "logon.php",
                        type: "post",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if (data.indexOf("valid-user")>=0 && data.mode == "logon") {
                                alert("User created");
                            } else if (data.indexOf("success")>=0) {
                                alert("user created - please logon");
                            } else {
                                alert("Error "+data);
                            }
                        },
                        error: function(jqXHR, status, error) {
                            alert("Error "+error);
                        }
                    });
                }
                
            }
            
        }
        
    }
    
}