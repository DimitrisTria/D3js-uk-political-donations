
var w = 1000, h = 650;
var nodes = [];
var chart1_2 = d3.select("#chart1_2");
var radius = d3.scale.sqrt().range([10, 20]);
var comma = d3.format(",.0f");
var fill = d3.scale.ordinal().range(["#FF0000", "#00FF00", "#FFFF00", "#0000FF"]);

var group_lst = ["group-all", "group-by-geographic-area", "group-by-region", "group-by-category-of-use"];
var currentGroup = group_lst[0];   // first group to show on window load
var previewsGroup = "";

$(document).ready(function () {
    d3.selectAll(".group").on("click", function (d) {
        currentGroup = d3.select(this).attr("id");
        if (previewsGroup != currentGroup) {
            groupButtonFocus(currentGroup, previewsGroup);
            previewsGroup = currentGroup;
            return transition_chart1_2(currentGroup);
        }
    });
    return d3.csv("assets/data/energy_consumption_2012_gr.csv", function(error, data) {
        if (error) return console.warn(error);
        chart1_2_Display(data);
    });
});

function transition_chart1_2(group) {
    if (group === "all-donations") {
        $("#all_ann").fadeIn(1000);
        $("#geographic-area_ann").fadeOut(250);
        $("#region_ann").fadeOut(250);
        $("#category_of_use_ann").fadeOut(250);
    }
    if (group === "group-by-money-source") {
        $("#all_ann").fadeIn(1000);
        $("#geographic-area_ann").fadeIn(1000);
        $("#region_ann").fadeOut(250);
        $("#category_of_use_ann").fadeOut(250);
    }
    if (group === "group-by-party") {
        $("#all_ann").fadeOut(250);
        $("#geographic-area_ann").fadeOut(250);
        $("#region_ann").fadeIn(1000);
        $("#category_of_use_ann").fadeOut(250);
    }
    if (group === "group-by-donor-type") {
        $("#all_ann").fadeOut(250);
        $("#geographic-area_ann").fadeOut(250);
        $("#region_ann").fadeOut(250);
        $("#category_of_use_ann").fadeIn(1000);
    }
    return total1_2();
}

var newTooltip = d3.select("body").append("div").attr("class", "tooltip").style({ "position": "absolute", "opacity": "1", "border": "2px solid black" });

function chart1_2_Display(data) {
    var maxVal = d3.max(data, function (d) { return d.total; });
    var radiusScale = d3.scale.sqrt().domain([0, maxVal]).range([10, 20]);
    data.forEach(function (d) {
        var node = {
            department_gr: d.department_gr,
            total: d.total,
            domestic_use: d.domestic_use,
            commercial_use: d.commercial_use,
            industrial_use: d.industrial_use,
            agricultural_use: d.agricultural_use,
            pub_and_municipal_authorities: d.pub_and_municipal_authorities,
            streeet_lighting: d.streeet_lighting,
            department_en: d.department_en,
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
    node = chart1_2.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("department_en", function (d) {
            return d.department_en;
        })
        .style("fill", function (d) {
            return fill(d.geographic_area);
        })
        .on("click", function (d) {
            window.open('http://google.com/search?q=' + d.department_en);
        })
        .on("mousemove", mousemoveCircle)
        .on("mouseout", mouseoutCircle);

    force.gravity(0).friction(0.75)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 3;
        })
        .on("tick", all1_2)
        .start();

    //circle build
    node.transition().duration(2500).attr("r", function (d) {
        return d.radius;
    });
}

function mousemoveCircle(d) {
    var infoBox1 = "<p> Department: <b>" + d.department_en + "</b></p>"
        + "<p> Total value: <b>" + comma(d.total) + " kwh</b></p>";
    var infoBox2 = "<p><b style='text-allign: center;'>analytic info box</b></p> <hr/>"
        + "<p> Department: <b>" + d.department_en + "</b></p>"
        + "<p> Domestic use: <b>" + comma(d.domestic_use) + " kwh</b></p>"
        + "<p> Commercia use: <b>" + comma(d.commercial_use) + " kwh</b></p>"
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

function mouseoutCircle() {
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
