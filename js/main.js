

var newColors_lst = ["#EE2288", "#22EE88", "#22FFEE"];
var oldToNewColors_dct = { "#F02233": "#EE2288", "#087FBD": "#22EE88", "#FDBB30": "#22FFEE" };
var mode_lst = ["mode_chart1_svg", "mode_chart2_svg", "mode_stats_charts_svgs"];
var mode_dct = { "mode_chart1_svg": transition_chart1_d3, "mode_chart2_svg": transition_chart2_d3, "mode_stats_charts_svgs": transition_stats_charts };
var group_lst = ["all-donations", "group-by-money-source", "group-by-party", "group-by-donor-type", "group-by-donor-amount"];

//initial content
var currentMode = mode_lst[0];
var currentGroup = group_lst[0];
var previewsMode = "";
var previewsGroup = "";

/* on page load */
    // check first lines of main_interacting.js
/* end of: on page load */

// mode selection
$(document).ready(function () {
    d3.selectAll(".mode").on("click", function () {
        currentMode = d3.select(this).attr("id");
        modeButtonSound.play();
        if (currentMode != previewsMode) {
            return currentEvent(currentMode, currentGroup);
        }
    });
});

// group selection
$(document).ready(function () {
    d3.selectAll(".group").on("click", function () {
        currentGroup = d3.select(this).attr("id");
        groupButtonSound.play();
        if (previewsGroup != currentGroup) {
            groupButtonFocus(currentGroup, previewsGroup); //marks current group button
            return currentEvent(currentMode, currentGroup);
        }
    });
});

function currentEvent(mode, group) {
    if (mode == mode_lst[0] || mode == mode_lst[1]) {
        $("#view-history-bar").fadeIn(1000);
    }
    else {
        $("#view-history-bar").fadeOut(250);
    }
    mode_dct[mode](group);

    //store latest mode and group
    previewsMode = currentMode;
    previewsGroup = currentGroup;
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

var chart2_event_data_dct = { "all-donations": "grp1", "group-by-money-source": "grp2", "group-by-party": "grp3", "group-by-donor-type": "grp4", "group-by-donor-amount": "grp5" };
function transition_chart2_d3(group) {
    d3.select("#chart2_svg").selectAll("*").remove(); // :)
    chart2Display(chart2_event_data_dct[group]);
}

function transition_stats_charts(group) {
    d3.select("#stats_chart1_svg").selectAll("*").remove(); // :)
    statsChart1Display(group);
}
