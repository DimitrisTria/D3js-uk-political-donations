
var chart1Tooltip = d3.select("body").append("div").attr("id", "chart1Tooltip");
var comma = d3.format(",.0f");

function clickCircle(d) {
    googleSearch(d.donor);
}

function mouseoverCircle(d) {
    // chart1Tooltip popup
    var imagePath = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + d.donor + ".ico";
    updateHistoryBar(d, imagePath);
    var amount = d3.select(this).attr("amount");
    var offset = $("svg").offset();
    d3.select(this).classed("active", true);

    /* info box */
    var infoBox = "<p> Source: <b>" + d.donor + "</b> " + "<span><img src='" + imagePath
        + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>"
        + "<p> Recipient: <b>" + d.partyLabel + "</b></p>"
        + "<p> Type of donor: <b>" + d.entityLabel + "</b></p>"
        + "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";

    /* info box apearance */   /* top: ... - 10 (boliko sto mati)*/
    chart1Tooltip.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
        .style("top", ((parseInt(d3.select(this).attr("cy") - (d.radius + 150)) + offset.top) - 13) + "px")
        .html(infoBox).style("display", "block");

    // responsiveVoice.speak(":" +d.donor +": with total value :" +comma(amount) +" pounds");
}

function mouseoutCircle() {
    /* no more chart1Tooltip */
    d3.select(this).classed("active", false);
    // responsiveVoice.cancel();
    chart1Tooltip.style("display", "none");
}
