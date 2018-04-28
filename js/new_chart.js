var newColors_lst = ["#EE2288", "#22EE88", "#22FFEE"];
var oldToNewColors_dct = { "#F02233": "#EE2288", "#087FBD": "#22EE88", "#FDBB30": "#22FFEE" };

var w = 1000, h = 650;
var nodes = [];
var new_chart = d3.select("#new_chart");
var radius = d3.scale.sqrt().range([10, 20]);
var comma = d3.format(",.0f");
var fill = d3.scale.ordinal().range(["#FF0000", "#00FF00", "#CACACA", "#0000FF"]);

var group_lst = ["group-all", "group-by-geographic-area", "group-by-region"];
var currentGroup = group_lst[0];   // first group to show on window load
var previewsGroup = "";

$(document).ready(function () {
    d3.selectAll(".group").on("click", function (d) {
        currentGroup = d3.select(this).attr("id");
        if (previewsGroup != currentGroup) {
            groupButtonFocus(currentGroup, previewsGroup);
            return transition(currentGroup);
        }
    });
    return d3.csv("assets/data/energy_consumption_2012_gr.csv", chart1Display);
});

function transition(group) {
    previewsGroup = currentGroup;
    return new_total();
}

var newTooltip = d3.select("body").append("div").attr("class", "tooltip").style({ "position": "absolute", "opacity": "1", "border": "2px solid black" });

function chart1Display(data) {
    var maxVal = d3.max(data, function (d) { return d.total; });
    var radiusScale = d3.scale.sqrt().domain([0, maxVal]).range([10, 20]);
    data.forEach(function (d) {
        var node = {
            department: d.department,
            total: d.total,
            domestic_use: d.domestic_use,
            commercia_use: d.commercia_use,
            industrial_use: d.industrial_use,
            agricultural_use: d.agricultural_use,
            pub_and_municipal_authorities: d.pub_and_municipal_authorities,
            streeet_lighting: d.streeet_lighting,
            geographic_area: d.geographic_area,
            region: d.region,
            radius: radiusScale(d.total),
            x: Math.random() * w,
            y: -radiusScale(d.total),
            color: d.color
        };

        nodes.push(node);
    });
    force = d3.layout.force().nodes(nodes).size([w, h]);

    // orismata ka8e kykloy
    node = new_chart.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("department", function (d) {
            return d.department;
        })
        .style("fill", function (d) {
            return fill(d.geographic_area);
        })
        .on("click", function (d) {
            window.open('http://google.com/search?q=' + d.department);
        })
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

    force.gravity(0).friction(0.75)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 3;
        })
        .on("tick", new_all)
        .start();

    //circle build
    node.transition().duration(2500).attr("r", function (d) {
        return d.radius;
    });
}

function mousemove(d) {
    var infoBox1 = "<p> Department: <b>" + d.department + "</b></p>"
        + "<p> Total value: <b>" + comma(d.total) + " kwh</b></p>";
    var infoBox2 = "<p><b style='text-allign: center;'>analytic info box</b></p> <hr/>"
        + "<p> Department: <b>" + d.department + "</b></p>"
        + "<p> Domestic use: <b>" + comma(d.domestic_use) + " kwh</b></p>"
        + "<p> Commercia use: <b>" + comma(d.commercia_use) + " kwh</b></p>"
        + "<p> Industrial use: <b>" + comma(d.industrial_use) + " kwh</b></p>"
        + "<p> Agricultural use: <b>" + comma(d.agricultural_use) + " kwh</b></p>"
        + "<p> Public and Municipal Authorities: <b>" + comma(d.pub_and_municipal_authorities) + " kwh</b></p>"
        + "<p> Streeet lighting: <b>" + comma(d.streeet_lighting) + " kwh</b></p>"
        + "<p> Region: <b>" + d.region + "</b></p>"
        + "<p> Geographic area: <b>" + d.geographic_area + "</b></p>"
        + "<p> Total value: <b>" + comma(d.total) + " kwh</b></p>";
    d3.select(this).style({ "cursor": "pointer", "stroke": "black", "stroke-width": "4px" });
    d3.select(".tooltip")
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY) + "px")
        .html(infoBox1)
        .style("border", "2px solid " + d.color)
        .style("border-radius", "2px")
        .style("display", "block");
    d3.select("#info-box")
        .html(infoBox2)
        .style("border", "2px solid " + d.color)
        .style("border-radius", "2px");
}

function mouseout() {
    d3.select(this).style({ "stroke": "white", "stroke-width": "0" });
    d3.select(".tooltip")
        .style("display", "none");
    d3.select("#info-box")
        .html("<p><b style='text-allign: center;'>analytic info box</b></p> <hr/>")
        .style("border", "2px solid black");
}

function groupButtonFocus(curGroup, prevGroup) {
    var curGroupElement = document.getElementById(curGroup);
    curGroupElement.style.color = "rgb(255, 255, 255)";
    curGroupElement.style.backgroundColor = "rgb(190, 190, 150)";

    if (prevGroup != "") {
        var prevGroupElement = document.getElementById(prevGroup);
        prevGroupElement.style.color = "rgb(0, 0, 0)";
        prevGroupElement.style.backgroundColor = "#E6E6E6";
    }
}
