/* ****** svg1_d3 ****** */
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
/* ****** end of: svg1_d3 ****** */
