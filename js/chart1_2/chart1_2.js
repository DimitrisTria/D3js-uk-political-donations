
var w = 1000, h = 650;
var nodes = [];
var chart1_2_svg = d3.select("#chart1_2_svg");
var radius = d3.scale.sqrt().range([10, 20]);
var comma = d3.format(",.0f");
var fill = d3.scale.ordinal().range(["#FF0000", "#00FF00", "#FFFF00", "#0000FF"]);

var group_lst = ["group-all", "group-by-geographic-area", "group-by-region", "group-by-category-of-use"];
var currentGroup = group_lst[0];   // first group to show on window load
var previewsGroup = "";
var groupButtonSound = new Audio();
groupButtonSound.src = "assets/sounds/groupButtonSound.wav";

$(document).ready(function () {
    d3.selectAll(".group").on("click", function (d) {
        currentGroup = d3.select(this).attr("id");
        if (previewsGroup != currentGroup) {
            groupButtonFocus(currentGroup, previewsGroup);
            previewsGroup = currentGroup;
            return transition_chart1_2(currentGroup);
        }
    });
    return d3.csv("assets/data/energy_consumption_2012_gr.csv", function (error, data) {
        if (error) return console.warn(error);
        chart1_2_Display(data);
    });
});

function transition_chart1_2(group) {
    groupButtonSound.play();
    if (group === "group-all") {
        $("#all_ann").fadeIn(1000);
        $("#geographic_area_ann").fadeOut(250);
        $("#region_ann").fadeOut(250);
        $("#category_of_use_ann").fadeOut(250);
    }
    if (group === "group-by-geographic-area") {
        $("#all_ann").fadeOut(250);
        $("#geographic_area_ann").fadeIn(1000);
        $("#region_ann").fadeOut(250);
        $("#category_of_use_ann").fadeOut(250);
    }
    if (group === "group-by-region") {
        $("#all_ann").fadeOut(250);
        $("#geographic_area_ann").fadeOut(250);
        $("#region_ann").fadeIn(1000);
        $("#category_of_use_ann").fadeOut(250);
    }
    if (group === "group-by-category-of-use") {
        $("#all_ann").fadeOut(250);
        $("#geographic_area_ann").fadeOut(250);
        $("#region_ann").fadeOut(250);
        $("#category_of_use_ann").fadeIn(1000);
    }
    return total1_2();
}

var chart1_2Tooltip = d3.select("body").append("div").attr("id", "chart1_2Tooltip");

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
    node = chart1_2_svg.append("g")
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
        .on("click", clickCircle)
        .on("mouseover", mouseoverCircle)
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

function clickCircle(d) {
    googleSearch(d.department_en);
}

function mouseoverCircle(d) {
    d3.select(this).style({ "cursor": "pointer", "stroke": "black", "stroke-width": "4px" });
    var infoBox = "<p><b style='text-allign: center;'>info box</b></p> <hr/>"
        + "<p> Department: <b>" + d.department_en + "</b></p>"
        + "<p> Region: <b>" + d.region + "</b></p>"
        + "<p> Geographic area: <b>" + d.geographic_area + "</p> </b>"
        + "<p> Domestic use: <b>" + comma(d.domestic_use) + " kwh</p> </b>"
        + "<p> Commercia use: <b>" + comma(d.commercial_use) + " kwh</p> </b>"
        + "<p> Industrial use: <b>" + comma(d.industrial_use) + " kwh</p> </b>"
        + "<p> Agricultural use: <b>" + comma(d.agricultural_use) + " kwh</p> </b>"
        + "<p> Public and Municipal Authorities: <b>" + comma(d.pub_and_municipal_authorities) + " kwh</p> </b>"
        + "<p> Streeet lighting: <b>" + comma(d.streeet_lighting) + " kwh</p> </b>"
        + "<p> Total value: <b>" + comma(d.total) + " kwh</p> </b>";
    d3.select("#info-box")
        .html(infoBox)
        .style("border", "2px solid " + d.color)
        .style("border-radius", "2px");
    responsiveVoice.speak(":" +d.department_en +": with total value :" +comma(d.total) +" kilowatt hours");
}

function mousemoveCircle(d) {
    var infoTooltip = "<p> Department: <b>" + d.department_en + "</b></p>"
        + "<p> Total value: <b>" + comma(d.total) + " kwh</b></p>";
    d3.select("#chart1_2Tooltip")
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY) + "px")
        .html(infoTooltip)
        .style("border", "2px solid " + d.color)
        .style("border-radius", "2px")
        .style("display", "block");
}

function mouseoutCircle() {
    d3.select(this).style({ "stroke": "white", "stroke-width": "0" });
    d3.select("#chart1_2Tooltip").style("display", "none");
    d3.select("#info-box")
        .html("<p><b style='text-allign: center;'>info box</b></p> <hr/>")
        .style("border", "2px solid black");
    responsiveVoice.cancel();
}

function googleSearch(itemToSearch) {
    window.open('http://google.com/search?q=' + itemToSearch);
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
