/* ****** svg ****** */
var w = 1000, h = 800;  //svg size for circles
var nodes = [];

var svg = d3.select("#svg");
var tooltip = d3.select("body").append("div").attr({ "id": "tooltip", "class": "tooltip" });
var radius = d3.scale.sqrt().range([10, 20]);
var fill = d3.scale.ordinal().range(["#CC0066", "#00CC66", "#00FFCC"]); //circles colors (purple-green-cyan)
var comma = d3.format(",.0f");

function display(data) {
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

    return start();
}

function start() {
    node = svg.append("g")
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
/* ****** end of: svg ****** */


/* ****** mysvg ****** */
// event dictionary
var events_dct = { "all-donations": 1, "group-by-money-source": 2, "group-by-party": 3, "group-by-donor-type": 4, "group-by-donor-amount": 5 };

// store data from csv to global list
var df_lst = [];
d3.csv("assets/data/7500up.csv", function (error, data) {
    if (error) {
        console.log("Error: data not loaded!");
    }
    df_list = calcDonorFreqByCategory(data);
});

// margins, width and height of mysvg
var margin = { top: 20, right: 10, bottom: 100, left: 50 };
var width = 1000 - margin.right - margin.left;
var height = 470 - margin.top - margin.bottom;

// define x and y scales
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2, 0.2);
var yScale = d3.scale.linear().range([height, 0]);

// define x axis and y axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

// draw mysvg
var lst = [];
function barChartDisplay(eventName) {
    lst = df_list[events_dct[eventName] - 1];
    var names_lst = [], values_lst = [];
    for (var i = 0; i < lst.length; i++) {
        names_lst[i] = lst[i][0];
        values_lst[i] = lst[i][1];
    }

    // get mysvg element
    var mysvg = d3.select("#mysvg")
        .attr({
            "width": width + margin.right + margin.left,
            "height": height + margin.top + margin.bottom
        })
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

    // Specify the domains of the x and y scales
    xScale.domain(names_lst.map(function (names_lst) { return names_lst; }));
    yScale.domain([0, d3.max(values_lst, function (values_lst) { return values_lst; })]);

    // draw bars
    mysvg.selectAll("rect")
        .data(lst).enter()
        .append("rect")
        .attr({
            "height": 0,
            "y": height
        })
        .transition().duration(3000).delay(function (i) { return i * 100; })
        .attr({
            "x": function (lst) { return xScale(lst[0]); },
            "y": function (lst) { return yScale(lst[1]); },
            "width": xScale.rangeBand(),
            "height": function (lst) { return height - yScale(lst[1]); }
        })
        .style({
            "fill": function (lst, i) { return "rgb(" + ((i * 10) + 1) + "," + ((i * 20) + 10) + "," + ((i * 30) + 100) + ")" }
        });

    // draw text in bar
    mysvg.selectAll("text")
        .data(lst).enter()
        .append("text")
        .text(function (lst) {
            return lst[1];
        })
        .attr({
            "x": function (lst) { return xScale(lst[0]) + xScale.rangeBand() / 2; },
            "y": function (lst) { return yScale(lst[1]) + 10; },
            "font-family": "sans-serif",
            "font-size": "13px",
            "font-weight": "bold",
            "fill": "white",
            "text-anchor": "middle"
        });

    // draw x axis
    mysvg.append("g")
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
    mysvg.append("g")
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
/* ****** end of: mysvg ****** */
