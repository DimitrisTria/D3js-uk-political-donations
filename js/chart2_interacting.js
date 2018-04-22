
var chart2Tooltip = d3.select("body").append("div").attr("id", "chart2Tooltip");

function format_number(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function format_description(d, imagePath) {
    var infoBox = "<img src='" + imagePath + "' ' height='42' width='42' '> </br>"
        + "<p> Source: <b>" + d.donor + "</b> </p>"
        + "<p> Recipient: <b>" + d.partyname + "</b> </p>"
        + "<p> Type of donor: <b>" + d.entityname + "</b> </p>"
        + "<p> Total value: <b>&#163;" + format_number(d.amount) + "</b> </p>";
    return infoBox;
}

function mouseOverArc(d) {
    d3.select(this).attr("stroke", "black").style("transform", "scale(1.05)");
    if (d.parent.donor != "root") {
        var imagePath = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + d.donor + ".ico";
        updateHistoryBar(d, imagePath);
        // responsiveVoice.speak(":" +d.donor +": with total value :" +d.amount +" pounds");
        chart2Tooltip.html(format_description(d, imagePath));
        return chart2Tooltip.style("display", "block").style("border", "2px solid" + oldToNewColors_dct[d.color]);
    }
    else {
        return null;
    }
}

function mouseOutArc(d) {
    d3.select(this).attr("stroke", "").style("transform", "scale(1)");
    // responsiveVoice.cancel();
    return chart2Tooltip.style("display", "none");
}

function mouseMoveArc(d) {
    if (d.parent.donor != "root") {
        return chart2Tooltip
            .style("top", (d3.event.pageY - 90) + "px")
            .style("left", (d3.event.pageX + 40) + "px");
    }
    else {
        return null;
    }
}
