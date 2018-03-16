/* global d3, w, nodes, h, all, responsiveVoice, sizeOfImageHistoryBar, listOfImageHistoryBarElement, donorsNameElement, newImgElement */

var w = 1000, h = 800;  //svg size for circles
var nodes = [];

/* svg s */
var svg = d3.select("#svg");
var mysvg = d3.select("#mysvg");
/* end of: svg s */

var tooltip = d3.select("body").append("div").attr("id", "tooltip").attr("class", "tooltip");
var radius = d3.scale.sqrt().range([10, 20]);
var fill = d3.scale.ordinal().range(["#CC0066", "#00CC66", "#00FFCC"]); //circles colors (purple-green-cyan)
var comma = d3.format(",.0f");

var sizeOfImageHistoryBar = 10, imageHistoryBarCounter = 0;
var donorsNameElement = document.getElementById("view-donors-name");
var listOfImageHistoryBarElement = document.getElementById("view-donor-image-history-bar");
var newPElement = document.createElement("P");
var newAElement = document.createElement("A");
var newImgElement = document.createElement("IMG");

/* ----- event handler ----- */
$(document).ready(function () {
    d3.selectAll(".switch").on("click", function () {
        var id = d3.select(this).attr("id");
        return transition(id);
    });
    return d3.csv("assets/data/7500up.csv", display);
});
/* ----- end of: event handler ----- */

/* ----- event mode ----- */
function transition(name) {
    if (name === "all-donations") {
        $("#initial-content").fadeIn(250);
        $("#value-scale").fadeIn(1000);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-by-amount-of-donation").fadeOut(250);
        return total();
    }
    if (name === "group-by-party") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeIn(1000);
        $("#view-by-amount-of-donation").fadeOut(250);
        return partyGroup();
    }
    if (name === "group-by-donor-type") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-donor-type").fadeIn(1000);
        $("#view-by-amount-of-donation").fadeOut(250);
        return donorType();
    }
    if (name === "group-by-money-source") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeIn(1000);
        $("#view-by-amount-of-donation").fadeOut(250);
        return fundsType();
    }
    if (name === "group-by-donor-amount") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-by-amount-of-donation").fadeIn(1000);
        return donorAmount();
    }
}
/* ----- end of: event mode ----- */

function display(data) {
    maxVal = d3.max(data, function (d) {
        return d.amount;
    });

    /* svg */
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
    /* end of: svg */

    /* mysvg */
    
    /* end of: mysvg */

    return start();
}

function start() {
    /* svg */
    node = svg.append("g").selectAll("circle").data(nodes).enter().append("circle")
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
    /* end of: svg */

    /* mysvg */

    /* end of: mysvg */
}
