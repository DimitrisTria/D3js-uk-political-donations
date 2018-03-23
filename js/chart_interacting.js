/* ----- Mouse events (on circles)  ----- */
var amount, offset, imagePath, infoBox;

function mouseoverCircle(d) {
    // tooltip popup
    imagePath = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + d.donor + ".ico";
    amount = d3.select(this).attr("amount");
    offset = $("svg").offset();
    d3.select(this).classed("active", true);

    /* info box */
    infoBox = "<p> Source: <b>" + d.donor + "</b> " + "<span><img src='" + imagePath
        + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>"
        + "<p> Recipient: <b>" + d.partyLabel + "</b></p>"
        + "<p> Type of donor: <b>" + d.entityLabel + "</b></p>"
        + "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";

    /* info box apearance */   /* top: ... - 10 (boliko sto mati)*/
    tooltip.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
        .style("top", ((parseInt(d3.select(this).attr("cy") - (d.radius + 150)) + offset.top) - 13) + "px")
        .style("z-index", 2).html(infoBox).style("display", "block");

    responsiveVoice.speak(":" +d.donor +": with total value :" +comma(amount) +" pounds");
    addImagesToHistoryBar(d, imagePath, amount);
}

function mouseoutCircle() {
    /* no more tooltips */
    d3.select(this).classed("active", false);
    d3.select(".tooltip").style("display", "none"); /* */
    responsiveVoice.cancel();
}

function clickCircle(d) {
    googleSearch(d.donor);
}
/* ----- end of: Mouse events (on circles) ----- */

/* search with google */
function googleSearch(itemToSearch) {
    window.open('http://google.com/search?q=' + itemToSearch);
}
/* end of: search with google */

/* image history bar */
var sizeOfImageHistoryBar = 10;
var imageHistoryBarCounter = 0;
var donorsNameElement = document.getElementById("view-donors-name");
var listOfImageHistoryBarElement = document.getElementById("view-donor-image-history-bar");
var newImgElement = document.createElement("IMG");
var newDColor = { "#F02233": "#CC0066", "#087FBD": "#00CC66", "#FDBB30": "#00FFCC" };

function addImagesToHistoryBar(d, imagePath, amount) {
    var imgNode = new Image(50, 50);
    imgNode.src = imagePath;
    imgNode.style.margin = "5px";
    imgNode.style.border = "2px solid " + newDColor[d.color];
    imgNode.onclick = function () {
        googleSearch(d.donor);
    };
    imgNode.onmouseover = function () {
        donorsNameElement.innerHTML = "<p class='myDefaultClass' style='color:" + newDColor[d.color] + "; border:2px solid black; \n\
                                          background-color:#ffffcc; width:350px; text-allign:center;'>" + d.donor + "</p>";
        responsiveVoice.speak(":" + d.donor + ": with total value :" + comma(amount) + " pounds");
    };
    imgNode.onmouseout = function () {
        donorsNameElement.innerHTML = "";
        responsiveVoice.cancel();
    };
    newImgElement.appendChild(imgNode);

    if (imageHistoryBarCounter >= sizeOfImageHistoryBar) {
        listOfImageHistoryBarElement.removeChild(listOfImageHistoryBarElement.childNodes[sizeOfImageHistoryBar - 1]); //remove last image
    } else {
        imageHistoryBarCounter = imageHistoryBarCounter + 1;
    }

    listOfImageHistoryBarElement.insertBefore(imgNode, listOfImageHistoryBarElement.childNodes[0]); //append new image
}
/* end of: image history bar */
