
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
    //addImagesToHistoryBar(imagePath, d, amount);
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
var imgNode, newDColor;
function addImagesToHistoryBar(imagePath, d, amount) {
    imgNode = new Image(50, 50);
    imgNode.src = imagePath;
    imgNode.style.margin = "5px";
    if (d.color === "#F02233") {
        newDColor = "#CC0066";
    }
    if (d.color === "#087FBD") {
        newDColor = "#00CC66";
    }
    if (d.color === "#FDBB30") {
        newDColor = "#00FFCC";
    }
    imgNode.style.border = "3px solid " + newDColor;
    imgNode.onclick = function () {
        googleSearch(d.donor);
    };
    imgNode.onmouseover = function () {
        if (d.color === "#F02233") {
            newDColor = "#CC0066";
        }
        if (d.color === "#087FBD") {
            newDColor = "#00CC66";
        }
        if (d.color === "#FDBB30") {
            newDColor = "#00FFCC";
        }
        donorsNameElement.innerHTML = "<p class='myDefaultClass' style='color:" + newDColor + "; border:2px solid black; \n\
                                          background-color:#ffffcc; width:350px; text-allign:center;'>" + d.donor + "</p>";

        //       tooltip.html("donor: " +d.donor +"<BR>" +"amount: " +d.amount)
        //                .style("left", (d3.event.pageX + 5) + "px")
        //                .style("top", (d3.event.pageY - 28) + "px")
        //                .style("opacity", 0.9);

        responsiveVoice.speak(":" + d.donor + ": with total value :" + comma(amount) + " pounds");
    };
    imgNode.onmouseout = function () {
        //tooltip.style("opacity", 0);
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
