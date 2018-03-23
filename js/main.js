var menuButtonSound = new Audio();
menuButtonSound.src = "assets/sounds/buttonSound.wav";

$(document).ready(function () {
    d3.selectAll(".switch").on("click", function () {
        var id = d3.select(this).attr("id");
        return transition(id);
    });
    return d3.csv("assets/data/temp/7500up.csv", display);
});

function transition(name) {
    d3.select("#mysvg").selectAll("*").remove();
    barChartDisplay(name);
    if (name === "all-donations") {
        $("#initial-content").fadeIn(250);
        $("#value-scale").fadeIn(1000);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-by-amount-of-donation").fadeOut(250);
        return total();
    }
    if (name === "group-by-money-source") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeIn(1000);
        $("#view-by-amount-of-donation").fadeOut(250);
        return fundsType();
    }
    if (name === "group-by-party") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeIn(1000);
        $("#view-by-amount-of-donation").fadeOut(250);
        return partyGroup();
    }
    if (name === "group-by-donor-type") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-donor-type").fadeIn(1000);
        $("#view-by-amount-of-donation").fadeOut(250);
        return donorType();
    }
    if (name === "group-by-donor-amount") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-by-amount-of-donation").fadeIn(1000);
        return donorAmount();
    }
}
