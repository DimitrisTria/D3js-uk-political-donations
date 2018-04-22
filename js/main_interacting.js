/* on page load */
document.getElementById(currentMode).click();
$(document).ready(function () {
    return d3.csv("assets/data/7500up.csv", chart1Display);
});
/* end of: on page load */

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

function modeButtonFocus(modeByElmnt, elmnt, color) {
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

function groupButtonFocus(curGroup, prevGroup) {
    var curGroupElement = document.getElementById(curGroup);
    curGroupElement.style.color = "rgb(255, 255, 255)";
    curGroupElement.style.backgroundColor = "rgb(190, 190, 150)";

    if(prevGroup!="") {
        var prevGroupElement = document.getElementById(prevGroup);
        prevGroupElement.style.color = "rgb(0, 0, 0)";
        prevGroupElement.style.backgroundColor = "#E6E6E6";
    }
}

/* image history bar */
var sizeOfHistoryBar = 8;
var historyBarItemsCounter = 0;
var historyBarElement = document.getElementById("view-history-bar");
var newImgElement = document.createElement("IMG");
var histTooltip = d3.select("body").append("div").attr("id", "histTooltip");

function updateHistoryBar(d, imagePath) {
    var imgNode = new Image(50, 50);
    imgNode.src = imagePath;
    imgNode.style.margin = "3px";
    imgNode.style.border = "2px solid black";
    imgNode.style.borderRadius = "4px";
    imgNode.onclick = function () {
        googleSearch(d.donor);
    };
    imgNode.onmouseover = function (event) {
        var pageX = event.clientX;
        var pageY = event.clientY;
        imgNode.style.boxShadow = "0 0 2px 1px rgba(50, 140, 186, 0.7)";
        histTooltip
            .style("opacity", 0.9)
            .html(d.donor)
            .style("left", pageX-170 +"px")
            .style("top", pageY +"px");
        // responsiveVoice.speak(":" + d.donor + ": with total value :" + d.amount + " pounds");
    };
    imgNode.onmouseout = function () {
        imgNode.style.boxShadow = "";
        histTooltip.style("opacity", 0);
        // responsiveVoice.cancel();
    };
    newImgElement.appendChild(imgNode);

    if (historyBarItemsCounter >= sizeOfHistoryBar) {
        historyBarElement.removeChild(historyBarElement.childNodes[sizeOfHistoryBar - 1]); //remove last image
    } else {
        historyBarItemsCounter = historyBarItemsCounter + 1;
    }
    historyBarElement.insertBefore(imgNode, historyBarElement.childNodes[0]); //append new image
}
/* end of: image history bar */
