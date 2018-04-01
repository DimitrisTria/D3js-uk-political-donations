var groupButtonSound = new Audio();
groupButtonSound.src = "assets/sounds/groupButtonSound.wav";

var modeButtonSound = new Audio();
modeButtonSound.src = "assets/sounds/modeButtonSound.wav";

/* header and footer colors */
var headerAndFooterColor = "rgba(170, 170, 170, 0.9)";
var header = document.getElementById("view-header");
header.style.backgroundColor = headerAndFooterColor;
var footer = document.getElementById("view-footer");
footer.style.backgroundColor = headerAndFooterColor;

/* search with google */
function googleSearch(itemToSearch) {
    window.open('http://google.com/search?q=' + itemToSearch);
}
/* end of: search with google */

function modeFocus(modeByElmnt, elmnt, color) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(modeByElmnt).style.display = "block";

    elmnt.style.backgroundColor = color;
}

function groupFocus(curGroup, prevGroup) {
    var curGroupElement = document.getElementById(curGroup);
    curGroupElement.style.color = "rgb(255, 255, 255)";
    curGroupElement.style.backgroundColor = "rgb(190, 190, 150)";

    if(prevGroup!="") {
        var prevGroupElement = document.getElementById(prevGroup);
        prevGroupElement.style.color = "rgb(0, 0, 0)";
        prevGroupElement.style.backgroundColor = "#E6E6E6";
    }
}
