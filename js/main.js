var mode_lst = ["mode_chart1_d3", "mode_chart2_d3", "mode_stats_charts_d3"];
var group_lst = ["all-donations", "group-by-money-source", "group-by-party", "group-by-donor-type", "group-by-donor-amount"];

//initial content
var currentMode = mode_lst[0];
var currentGroup = group_lst[0];
var previewsMode = "";
var previewsGroup = "";

// mode selection
$(document).ready(function () {
    d3.selectAll(".mode").on("click", function () {
        currentMode = d3.select(this).attr("id");
        modeButtonSound.play();
        if (currentMode != previewsMode) {
            previewsMode = currentMode;
            return evnt(currentMode, currentGroup);
        }
    });
});

// group selection
$(document).ready(function () {
    d3.selectAll(".group").on("click", function () {
        currentGroup = d3.select(this).attr("id");
        groupButtonSound.play();
        if (previewsGroup != currentGroup) {
            groupFocus(currentGroup, previewsGroup);
            previewsGroup = currentGroup;
            return evnt(currentMode, currentGroup);
        }
    });
});

var mode_dct = {
    "mode_chart1_d3": transition_chart1_d3,
    "mode_chart2_d3": transition_chart2_d3,
    "mode_stats_charts_d3": transition_stats_charts
};

function evnt(mode, group) {
    if (mode == mode_lst[0] || mode == mode_lst[1]) {
        $("#view-history-bar").fadeIn(1000);
    }
    else {
        $("#view-history-bar").fadeOut(250);
    }
    mode_dct[mode](group);
}

function transition_chart1_d3(group) {
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

function transition_chart2_d3(group) {
    console.log("-" + currentMode);
}

function transition_stats_charts(group) {
    d3.select("#stats_chart1_d3").selectAll("*").remove(); // :)
    barChartDisplay(group);
}
