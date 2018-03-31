/* ****** svg1_d3 ****** */
var w = 1000, h = 800;
var nodes = [];

var svg1_d3 = d3.select("#svg1_d3");
var tooltip = d3.select("body").append("div").attr({ "id": "tooltip", "class": "tooltip" });
var radius = d3.scale.sqrt().range([10, 20]);
var fill = d3.scale.ordinal().range(["#CC0066", "#00CC66", "#00FFCC"]); //circles colors (purple-green-cyan)
var comma = d3.format(",.0f");

function circlesChartDisplay(data) {
    maxVal = d3.max(data, function (d) { return d.amount; });
    var radiusScale = d3.scale.sqrt().domain([0, maxVal]).range([10, 20]);
    data.forEach(function (d) {
        var node = {
            radius: radiusScale(d.amount) / 5,
            value: d.amount,
            donor: d.donor,
            party: d.party,
            partyLabel: d.partyname,
            entity: d.entity,
            entityLabel: d.entityname,
            color: d.color,
            x: Math.random() * w,
            y: -radiusScale(d.amount)
        };

        nodes.push(node);
    });
    force = d3.layout.force().nodes(nodes).size([w, h]);

    node = svg1_d3.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return "node " + d.party;
        })
        .attr("amount", function (d) {
            return d.value;
        })
        .attr("donor", function (d) {
            return d.donor;
        })
        .attr("entity", function (d) {
            return d.entity;
        })
        .attr("party", function (d) {
            return d.party;
        })
        .attr("r", 0)
        .style("fill", function (d) {
            return fill(d.party);
        })
        .on("mouseover", mouseoverCircle)
        .on("mouseout", mouseoutCircle)
        .on("click", clickCircle);

    force.gravity(0).friction(0.75)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 3;
        })
        .on("tick", all)
        .start();

    //circle build
    node.transition().duration(2500).attr("r", function (d) {
        return d.radius;
    });
}
/* ****** end of: svg1_d3 ****** */


/* ****** svg1_stats_d3 ****** */
// store data from csv to global list
var dataset = 0;
var category_stats_lst = [];
var category_stats_dct = {};
d3.csv("assets/data/7500up.csv", function (error, data) {
    if (error) { console.log("Error: data not loaded!"); }
    else { dataset = data; }
    category_stats_lst = calcDonorFreqByCategory(dataset);
    category_stats_dct = { "all-donations": category_stats_lst[0], "group-by-money-source": category_stats_lst[1], "group-by-party": category_stats_lst[2], "group-by-donor-type": category_stats_lst[3], "group-by-donor-amount": category_stats_lst[4] };
});

// margins, width and height of svg_stats1
var margin = { top: 20, right: 10, bottom: 100, left: 50 };
var width = 750 - margin.right - margin.left;
var height = 470 - margin.top - margin.bottom;

// define x and y scales
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2, 0.2);
var yScale = d3.scale.linear().range([height, 0]);

// define x axis and y axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

// draw svg1_stats_d3
var current_stats_lst = [];
function barChartDisplay(eventName) {
    current_stats_lst = category_stats_dct[eventName];
    var names_lst = [], values_lst = [];
    for (var i = 0; i < current_stats_lst.length; i++) {
        names_lst[i] = current_stats_lst[i][0];
        values_lst[i] = current_stats_lst[i][1];
    }

    // get svg1_stats_d3 element
    var svg1_stats_d3 = d3.select("#svg1_stats_d3")
        .attr({
            "width": width + margin.right + margin.left,
            "height": height + margin.top + margin.bottom
        })
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .on("click", function () {
            console.log("rect clicked");
        });

    // Specify the domains of the x and y scales
    xScale.domain(names_lst.map(function (names_lst) { return names_lst; }));
    yScale.domain([0, d3.max(values_lst, function (values_lst) { return values_lst; })]);

    // draw bars
    svg1_stats_d3.selectAll("rect")
        .data(current_stats_lst).enter()
        .append("rect")
        .attr({
            "height": 0,
            "y": height
        })
        .transition().duration(3000).delay(function (i) { return i * 100; })
        .attr({
            "x": function (current_stats_lst) { return xScale(current_stats_lst[0]); },
            "y": function (current_stats_lst) { return yScale(current_stats_lst[1]); },
            "width": xScale.rangeBand(),
            "height": function (current_stats_lst) { return height - yScale(current_stats_lst[1]); }
        })
        .style({
            "fill": function (current_stats_lst, i) { return "rgb(" + ((i * 10) + 1) + "," + ((i * 20) + 10) + "," + ((i * 30) + 100) + ")" }
        });

    // draw text in bar
    svg1_stats_d3.selectAll("text")
        .data(current_stats_lst).enter()
        .append("text")
        .text(function (current_stats_lst) {
            return current_stats_lst[1];
        })
        .attr({
            "x": function (current_stats_lst) { return xScale(current_stats_lst[0]) + xScale.rangeBand() / 2; },
            "y": function (current_stats_lst) { return yScale(current_stats_lst[1]) + 10; },
            "font-family": "sans-serif",
            "font-size": "13px",
            "font-weight": "bold",
            "fill": "white",
            "text-anchor": "middle"
        });

    // draw x axis
    svg1_stats_d3.append("g")
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
    svg1_stats_d3.append("g")
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
        .style([
            "text-anchor", "middle"
        ])
        .text("frequency");
}
/* ****** end of: svg1_stats_d3 ****** */


/* ****** svg2_d3 ****** */
// d3.select("#view-first-d3").transition(10000).style("background-color","black");

var svg2 = d3.select("#svg2");

/* ****** end of: svg2_d3 ****** */

/* new */
// Get the element with id="defaultOpen" and click on it
document.getElementById("mode_svg1_d3").click();

function changeTab(modeByElmnt, elmnt, color) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(modeByElmnt).style.display = "block";

    elmnt.style.backgroundColor = color;
}
/* end of new */
