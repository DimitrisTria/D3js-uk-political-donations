//initial content
var mode = "mode_svg1_d3";
var group = "all-donations";

var previewsMode = "";
var previewsGroup = "";

// on first page load
$(document).ready(function () {
    return d3.csv("assets/data/7500up.csv", circlesChartDisplay);
});

// mode selection
$(document).ready(function () {
    d3.selectAll(".mode").on("click", function () {
        mode = d3.select(this).attr("id");
        modeButtonSound.play();
        if (mode != previewsMode) {
            previewsMode = mode;
            
            return switchMode(mode, group);
        }
    });
});

// group selection
$(document).ready(function () {
    d3.selectAll(".group").on("click", function () {
        group = d3.select(this).attr("id");
        groupButtonSound.play();
        if (previewsGroup != group) {
            previewsGroup = group;
            return switchMode(mode, group);
        }
    });
});

var mode_dct = {
    "mode_svg1_d3": transition_svg1,
    "mode_svg2_d3": transition_svg2,
    "mode_svg1_stats_d3": transition_svg1_stats
};

function switchMode(mode, group) {
    mode_dct[mode](group);
}

function transition_svg1(group) {
    $("#view-history-bar").fadeIn(1000);
    if (group === "all-donations") {
        $("#initial-content").fadeIn(1000);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-by-amount").fadeOut(250);
        return total();
    }
    if (group === "group-by-money-source") {
        $("#initial-content").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeIn(1000);
        $("#view-by-amount").fadeOut(250);
        return fundsType();
    }
    if (group === "group-by-party") {
        $("#initial-content").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeIn(1000);
        $("#view-by-amount").fadeOut(250);
        return partyGroup();
    }
    if (group === "group-by-donor-type") {
        $("#initial-content").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-donor-type").fadeIn(1000);
        $("#view-by-amount").fadeOut(250);
        return donorType();
    }
    if (group === "group-by-donor-amount") {
        $("#initial-content").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-by-amount").fadeIn(1000);
        return donorAmount();
    }
}

function transition_svg2(group) {
    $("#view-history-bar").fadeIn(1000);
    console.log("-" + mode);
}

function transition_svg1_stats(group) {
    $("#view-history-bar").fadeOut(250);
    d3.select("#svg1_stats_d3").selectAll("*").remove();
    barChartDisplay(group);
}
