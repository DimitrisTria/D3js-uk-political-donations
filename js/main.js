//initial content
var currentMode = "mode_svg1_d3";
var currentGroup = "all-donations";

var previewsMode = "";
var previewsGroup = "";

// mode selection
$(document).ready(function () {
    d3.selectAll(".mode").on("click", function () {
        currentMode = d3.select(this).attr("id");
        modeButtonSound.play();
        if (currentMode != previewsMode) {
            groupFocus(currentGroup,previewsGroup);
            previewsMode = currentMode;
            return tab(currentMode, currentGroup);
        }
    });
});

// group selection
$(document).ready(function () {
    d3.selectAll(".group").on("click", function () {
        currentGroup = d3.select(this).attr("id");
        groupButtonSound.play();
        if (previewsGroup != currentGroup) {
            groupFocus(currentGroup,previewsGroup);
            previewsGroup = currentGroup;
            return tab(currentMode, currentGroup);
        }
    });
});

var mode_dct = {
    "mode_svg1_d3": transition_svg1,
    "mode_svg2_d3": transition_svg2,
    "mode_svg1_stats_d3": transition_svg1_stats
};

var group_lst = ["all-donations","group-by-money-source","group-by-party","group-by-donor-type","group-by-donor-amount"];

function tab(mode, group) {
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
    d3.select("#svg1_stats_d3").selectAll("*").remove(); // :)
    barChartDisplay(group);
}
