
// stats_chart1_margins, width and height of stats_chart1_svg
var stats_chart1_margin = { top: 20, right: 10, bottom: 100, left: 50 };
var width = 750 - stats_chart1_margin.right - stats_chart1_margin.left;
var height = 470 - stats_chart1_margin.top - stats_chart1_margin.bottom;

// define x and y scales
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2, 0.2);
var yScale = d3.scale.linear().range([height, 0]);

// define x axis and y axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

function statsChart1Display(eventName) {
    var currentStats_lst = stats_chart1_dct[eventName];
    var names_lst = [], values_lst = [];
    for (var i = 0; i < currentStats_lst.length; i++) {
        names_lst[i] = currentStats_lst[i][0];
        values_lst[i] = currentStats_lst[i][1];
    }

    // get stats_chart1_svg element
    var stats_chart1_svg = d3.select("#stats_chart1_svg")
        .attr({
            "width": width + stats_chart1_margin.right + stats_chart1_margin.left,
            "height": height + stats_chart1_margin.top + stats_chart1_margin.bottom
        })
        .append("g")
        .attr("transform", "translate(" + stats_chart1_margin.left + "," + stats_chart1_margin.right + ")")
        .on("click", function () {
            console.log("rect clicked");
        });

    // Specify the domains of the x and y scales
    xScale.domain(names_lst.map(function (names_lst) { return names_lst; }));
    yScale.domain([0, d3.max(values_lst, function (values_lst) { return values_lst; })]);

    // draw bars
    stats_chart1_svg.selectAll("rect")
        .data(currentStats_lst).enter()
        .append("rect")
        .attr({
            "height": 0,
            "y": height
        })
        .transition().duration(3000).delay(function (i) { return i * 100; })
        .attr({
            "x": function (currentStats_lst) { return xScale(currentStats_lst[0]); },
            "y": function (currentStats_lst) { return yScale(currentStats_lst[1]); },
            "width": xScale.rangeBand(),
            "height": function (currentStats_lst) { return height - yScale(currentStats_lst[1]); }
        })
        .style({
            "fill": function (currentStats_lst, i) { return "rgb(" + ((i * 10) + 1) + "," + ((i * 20) + 10) + "," + ((i * 30) + 100) + ")" }
        });

    // draw text in bar
    stats_chart1_svg.selectAll("text")
        .data(currentStats_lst).enter()
        .append("text")
        .text(function (currentStats_lst) {
            return currentStats_lst[1];
        })
        .attr({
            "x": function (currentStats_lst) { return xScale(currentStats_lst[0]) + xScale.rangeBand() / 2; },
            "y": function (currentStats_lst) { return yScale(currentStats_lst[1]) + 10; },
            "font-family": "sans-serif",
            "font-size": "14px",
            "font-weight": "bold",
            "fill": "white",
            "text-anchor": "middle"
        });

    // draw x axis
    stats_chart1_svg.append("g")
        .attr({
            "class": "x axis",
            "transform": "translate(0," + height + ")"
        })
        .call(xAxis)
        .selectAll("text")
        .attr({
            "dx": "-.8em",
            "dy": ".25em",
            "transform": "rotate(-60)",
            "font-size": "10px"
        })
        .style({
            "text-anchor": "end"
        });

    // draw y axis
    stats_chart1_svg.append("g")
        .attr({
            "class": "y axis"
        })
        .call(yAxis)
        .append("text")
        .attr({
            "transform": "rotate(-90)",
            "x": -height / 2,
            "dy": "-3em"
        })
        .style({
            "text-anchor": "middle"
        })
        .text("frequency");
}
/* ****** end of: stats_chart1_svg ****** */
