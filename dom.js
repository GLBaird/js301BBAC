"use strict";

var records = document.getElementById('records');

records.style.background = "red";

// alert(records.innerHTML);
// records.innerHTML = "<li>Hi there</li>";

var h1 = document.getElementsByTagName("h1")[0];
h1.innerHTML = "I am the DOM!";

//var boring = document.getElementsByClassName("boring");
//console.log(boring);

var boring = [];

var p = document.getElementsByTagName("p");

for (var i in p) {
    if (typeof p[i].className == "string"
        && p[i].className.indexOf("boring")>=0) {
        boring.push(p[i]);
    }
}

console.log(boring);

for (var i in boring) {
    boring[i].style.color = "blue";
}

// get rid of empty

var results = document.getElementById("results");
var children = results.childNodes;
console.log(children.length);

for (var i=children.length-1; i>=0; i--) {
    console.log(children[i]);
    results.removeChild(children[i]);
}

var names = ["Bob", "Betty", "Sheila", "Mike"];

for (var i in names) {
    
    var p = document.createElement("p");
    p.appendChild(
        document.createTextNode(names[i])
    );
    
    p.setAttribute("data-index", i);
    
    results.appendChild(p);
    
    /* JQuery method
    $("#results").append(
        $("<p />")
            .html(names[i])
            .attr("data=index", i)
    );
    */
    
}


// Dom Walk

var a = document.getElementById("records").getElementsByTagName("a");

function handleClick(e) {
    e = e || window.Event;
    e.preventDefault();
    console.log(e);
    var ref = e.target.parentNode.getAttribute("data-id");
    alert(ref);
}

for (var i=0; i<a.length; i++) {
    console.log(a[i]);
    a[i].onclick = handleClick;
}


// var parsed = eval("("+data+")");

var data = JSON.stringify({
    userID: "LB123",
    record: "12",
    key: "Surname",
    value: "Bob"
});

var jsonOBJ = JSON.parse(data);




