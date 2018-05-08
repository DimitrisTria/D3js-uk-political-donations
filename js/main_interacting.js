
/* audio */
var modeButtonSound = new Audio("assets/audio/modeButtonSound.wav");
var groupButtonSound = new Audio("assets/audio/groupButtonSound.wav");

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

/* modeButtonFocus */
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
/* end of: modeButtonFocus */

/* groupButtonFocus */
function groupButtonFocus(curGroup, prevGroup) {
    var curGroupElement = document.getElementById(curGroup);
    curGroupElement.style.color = "rgb(255, 255, 255)"; //letter's color
    curGroupElement.style.backgroundColor = "rgb(190, 190, 150)";

    if (prevGroup != "") {
        var prevGroupElement = document.getElementById(prevGroup);
        prevGroupElement.style.color = "rgb(0, 0, 0)";
        prevGroupElement.style.backgroundColor = "#E6E6E6";
    }
}
/* end of: groupButtonFocus */

/* image history bar */
var sizeOfHistoryBar = 8;
var historyBarItemsCounter = 0;
var historyBarElement = document.getElementById("view-history-bar");
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
    imgNode.onmousemove = function (event) {
        var pageX = event.clientX;
        var pageY = event.clientY;
        imgNode.style.boxShadow = "0 0 2px 1px rgba(50, 140, 186, 0.7)";
        histTooltip
            .style("opacity", "0.9")
            .html(d.donor)
            .style("width", "auto")
            .style("height", "auto")
            .style("left", pageX - 155 + "px")
            .style("top", pageY + "px");
        responsiveVoice.speak(":" + d.donor + ": with total value :" + d.amount + " pounds");
    };
    imgNode.onmouseout = function () {
        imgNode.style.boxShadow = "";
        histTooltip.style("opacity", "0");
        responsiveVoice.cancel();
    };

    if (historyBarItemsCounter >= sizeOfHistoryBar) {
        historyBarElement.removeChild(historyBarElement.childNodes[sizeOfHistoryBar - 1]); //remove last image
    } else {
        historyBarItemsCounter = historyBarItemsCounter + 1;
    }
    historyBarElement.insertBefore(imgNode, historyBarElement.childNodes[0]); //append new image on top
}
/* end of: image history bar */
