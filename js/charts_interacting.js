/* ****** chart1_d3 ****** */
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

    // responsiveVoice.speak(":" +d.donor +": with total value :" +comma(amount) +" pounds");
    updateHistoryBar(d, imagePath, amount);
}

function mouseoutCircle() {
    /* no more tooltips */
    d3.select(this).classed("active", false);
    d3.select(".tooltip").style("display", "none"); /* */
    // responsiveVoice.cancel();
}

function clickCircle(d) {
    googleSearch(d.donor);
}
/* ****** end of: chart1_d3 ****** */

/* ****** chart1_d3 ****** */
//
/* ****** end of: chart1_d3 ****** */

/* ****** stats_chart1_d3 ****** */
//
/* ****** end of: stats_chart1_d3 ****** */


/* image history bar */
var sizeOfHistoryBar = 8;
var historyBarItemsCounter = 0;
var historyBarElement = document.getElementById("view-history-bar");
var newImgElement = document.createElement("IMG");
var newDColor = { "#F02233": "#CC0066", "#087FBD": "#00CC66", "#FDBB30": "#00FFCC" };
var histTooltip = d3.select("body").append("div").attr("id", "histTooltip");

function updateHistoryBar(d, imagePath, amount) {
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
        d3.select("#histTooltip")
            .style("opacity", 0.9)
            .html(d.donor)
            .style("left", pageX-170 +"px")
            .style("top", pageY +"px");
        // responsiveVoice.speak(":" + d.donor + ": with total value :" + comma(amount) + " pounds");
    };
    imgNode.onmouseout = function () {
        imgNode.style.boxShadow = "";
        d3.select("#histTooltip").style("opacity", 0);
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
