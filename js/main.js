
var newColors_lst = ["#EE2288", "#22EE88", "#22FFEE"];
var oldToNewColors_dct = { "#F02233": "#EE2288", "#087FBD": "#22EE88", "#FDBB30": "#22FFEE" };
var mode_lst = ["mode_chart1_svg", "mode_chart2_svg", "mode_stats_charts_svgs"];
var mode_dct = { "mode_chart1_svg": transition_chart1, "mode_chart2_svg": transition_chart2, "mode_stats_charts_svgs": transition_stats_charts };
var group_lst = ["all-donations", "group-by-money-source", "group-by-party", "group-by-donor-type", "group-by-donor-amount"];

//initial content
var currentMode = mode_lst[0];
var previewsMode = "";
var currentGroup = group_lst[0];
var previewsGroup = "";


/* ****** on click events ******/
// mode selection
$(document).ready(function () {
    d3.selectAll(".mode").on("click", function () {
        currentMode = d3.select(this).attr("id");
        modeButtonSound.play();
        if (currentMode != previewsMode) {
            return currentEvent(currentMode, currentGroup);
        }
    });

    d3.selectAll(".group").on("click", function () {
        currentGroup = d3.select(this).attr("id");
        groupButtonSound.play();
        if (previewsGroup != currentGroup) {
            groupButtonFocus(currentGroup, previewsGroup); //marks current group button
            return currentEvent(currentMode, currentGroup);
        }
    });
    return d3.csv("assets/data/7500up.csv", function(error, data) {
        if (error) { console.warn(error); }
        else {
            document.getElementById(currentMode).click();
            chart1Display(data);
        }
    });
});
/* ****** end of: on click events ******/

function currentEvent(mode, group) {
    if (mode == mode_lst[0] || mode == mode_lst[1]) {
        $("#view-history-bar").fadeIn(1000);
    }
    else {
        $("#view-history-bar").fadeOut(150);
    }
    mode_dct[mode](group);

    //store latest mode and group
    previewsMode = mode;
    previewsGroup = group;
}

function transition_chart1(group) {
    if (group === group_lst[0]) {
        $("#initial-content").fadeIn(850);
        $("#view-source-type").fadeOut(150);
        $("#view-party-type").fadeOut(150);
        $("#view-donor-type").fadeOut(150);
        $("#view-by-amount").fadeOut(150);
    }
    else if (group === group_lst[1]) {
        $("#initial-content").fadeOut(150);
        $("#view-source-type").fadeIn(850);
        $("#view-party-type").fadeOut(150);
        $("#view-donor-type").fadeOut(150);
        $("#view-by-amount").fadeOut(150);
    }
    else if (group === group_lst[2]) {
        $("#initial-content").fadeOut(150);
        $("#view-source-type").fadeOut(150);
        $("#view-party-type").fadeIn(850);
        $("#view-donor-type").fadeOut(150);
        $("#view-by-amount").fadeOut(150);
    }
    else if (group === group_lst[3]) {
        $("#initial-content").fadeOut(150);
        $("#view-party-type").fadeOut(150);
        $("#view-source-type").fadeOut(150);
        $("#view-donor-type").fadeIn(850);
        $("#view-by-amount").fadeOut(150);
    }
    else if (group === group_lst[4]) {
        $("#initial-content").fadeOut(150);
        $("#view-donor-type").fadeOut(150);
        $("#view-party-type").fadeOut(150);
        $("#view-source-type").fadeOut(150);
        $("#view-by-amount").fadeIn(850);
    }
    return total1();
}

function transition_chart2(group) {
    d3.select("#chart2_svg").selectAll("*").remove(); // :)
    chart2Display(group);
}

function transition_stats_charts(group) {
    d3.select("#stats_chart1_svg").selectAll("*").remove(); // :)
    statsChart1Display(group);
}
