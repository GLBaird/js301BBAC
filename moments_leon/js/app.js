
var PanelViewMoments = "momentsView";
var PanelViewUpload  = "uploadView";
var PanelViewLogon   = "logonView";

var app = {
    
    init: function() {
        this.ui.init();
        
        // listen for new userID
        this.ui.viewControllers.logonPanel.delegate = this.newUserIdReceived.bind(this);
    },
    
    userID: null,
    
    newUserIdReceived: function(userID) {
        this.userID = userID;
        this.ui.viewControllers.momentsList.userID = userID;
        this.ui.viewControllers.uploadPanel.userID = userID;
        this.ui.viewControllers.momentsList.updateList();
    },
    
    ui: {
        
        init: function() {
            $("nav").click(this.toolbarClicked.bind(this));
            
            // initialise view controllers
            this.viewControllers.logonPanel.init();
            this.viewControllers.uploadPanel.init();
            this.viewControllers.momentsList.loadLocalStorage();
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
                
                userID: null,
                
                updateList: function() {
                    
                    if (navigator.onLine) {
                        // download list when online
                        $.ajax({
                            url: "get.php",
                            type: "post",
                            data: {
                                userID: this.userID
                            },
                            dataType: "json",
                            success: function(data) {
                                this.storeList(data);
                                this.displayList(data);
                            }.bind(this),
                            error: function(jqXHR, status, error) {
                                alert("Error "+error);
                            }
                        });
                    } else {
                        // call from local storage
                        this.loadLocalStorage();
                    }
                },
                
                loadLocalStorage: function() {
                    if (typeof localStorage.moments != "undefined") {
                        var list = JSON.parse(localStorage.moments);
                        this.displayList(list);
                    }
                },
                
                displayList: function(list) {
                    var listView = $("section#momentsView ul.listview");
                    listView.empty();
                    
                    for(var i=0; i<list.length; i++) {
                        var item = list[i];
                        
                        var date = new Date(item.date*1000);
                        date = date.getDate()+"/"+
                               date.getMonth()+"/"+
                               date.getFullYear();
                               
                        listView.append(
                            $("<li>")
                                .append(
                                    $("<span>")
                                        .addClass("pic")
                                        .attr("style", "background-image: url("+item.picture+");")
                                )
                                .append(
                                    document.createTextNode(item.moment)
                                )
                                .append(
                                    $("<span>")
                                        .addClass("date")
                                        .html(date)
                                )
                        );
                    }
                },
                
                storeList: function(list) {
                    localStorage.moments = JSON.stringify(list);
                    console.log("Stored", localStorage.moments);
                }
                
            },
            
            uploadPanel: {
                
                userID: null,
                
                updateListener: null,
                
                init: function() {
                    
                    $("#uploadFile").change(this.uploadFileChanged.bind(this));
                    $("#uploadButton").click(this.uploadData.bind(this));
                    $("#uploadForm").submit(function(e) {
                        e.preventDefault();
                    });
                },
                
                uploadData: function(e) {
                    e.preventDefault();
                    
                    // validate form
                    
                    var fd = new FormData();
                    fd.append('moment', $("#uploadTitle").val());
                    fd.append('picture[]', this.file, this.file.name);
                    fd.append('type', $("input[name='momentType']:checked").val());
                    fd.append('userID', this.userID);
                    
                    $.ajax({
                        url: "put.php",
                        type: "post",
                        data: fd,
                        processData: false,
                        contentType: false,
                        dataType: "text",
                        success: function(data) {
                            if (data.indexOf("success")>=0) {
                                alert("Your moment has been saved");
                                this.resetUI();
                                
                                // pass on update event so moments can reload list
                                if (typeof this.updateListener == "function") {
                                    this.updateListener();
                                }
                            } else {
                                alert("Error "+data);
                            }
                        }.bind(this),
                        error: function(jqXHR, status, error) {
                            alert("Error "+error);
                        }
                    });
                    
                },
                
                resetUI: function() {
                    $("#uploadTitle").val("");
                    $("input[name='momentType']").prop("checked", false);
                    $("input[value='Personal']").prop("checked", true);
                    $("#imagePreview").removeAttr("style");
                    var upload = $("#uploadFile");
                    upload.replaceWith(upload.clone(true));
                    this.file = null;
                },
                
                uploadFileChanged: function(e) {
                    var file = e.target.files[0];
                    if (file.type.indexOf("image")<0) {
                        alert("You must submit an image!");
                        e.preventDefault();
                        return;
                    }
                    
                    this.file = file;
                    
                    // get preview and display
                    var tmpPath = URL.createObjectURL(file);
                    $("#imagePreview").css(
                        "background-image", "url("+tmpPath+")"
                    );
                }
                
            },
            
            logonPanel: {
                
                mode: "logon",
                
                delegate: null,
                
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
                        success: function(resp) {
                            if (resp.indexOf("valid-user")>=0 && data.type == "logon") {
                                alert("User logged on");
                                if (typeof this.delegate == "function") {
                                    this.delegate(resp.split(":").pop())
                                }
                            } else if (resp.indexOf("success")>=0) {
                                alert("user created - please logon");
                            } else {
                                alert("Error "+resp);
                            }
                        }.bind(this),
                        error: function(jqXHR, status, error) {
                            alert("Error "+error);
                        }
                    });
                }
                
            }
            
        }
        
    }
    
}