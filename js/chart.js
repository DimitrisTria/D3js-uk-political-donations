/* global d3, responsiveVoice */

/* ----- Global variables ----- */
var w = 1000, h = 900;  //window size for circles
var padding = 2;    //?
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;    //when clicking tabs
var radius = d3.scale.sqrt().range([10, 20]);

//mode: split by party, (circles positions)
var partyCentres = {
    con: { x: w / 3, y: h / 3.3},
    lab: {x: w / 3, y: h / 2.3},
    lib: {x: w / 3, y: h / 1.8}
};

//mode: split by type of donor, (circles positions)
var entityCentres = {
    company: {x: w / 3.65, y: h / 2.3},
    union: {x: w / 3.65, y: h / 1.8},
    other: {x: w / 1.15, y: h / 1.9},
    society: {x: w / 1.12, y: h  / 3.2 },
    pub: {x: w / 1.8, y: h / 2.8},
    individual: {x: w / 3.65, y: h / 3.3}
};

//circles colors (green-purple-cyan)
var fill = d3.scale.ordinal().range(["#CC0066", "#00CC66", "#00FFCC"]);

//all money (circles positions)
var svgCentre = {
    x: w / 3.6,
    y: h / 2
};

var svg = d3.select("#chart")
            .append("svg")
            .attr("id", "svg")
            .attr("width", w)
            .attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip")
                .attr("id", "tooltip");

var comma = d3.format(",.0f");

var donorAmountPos = {
    first: {x: 300, y: 270},
    second: {x: 500, y: 270},
    third: {x: 700, y: 270}
};
/* ----- end of Global variables ----- */

/* ----- event handler ----- */
$(document).ready(function() {
    d3.selectAll(".switch").on("click", function() {
        var id = d3.select(this).attr("id");
        return transition(id);
    });
    return d3.csv("assets/data/7500up.csv", display);
});
/* ----- end of: event handler ----- */

function display(data) {
    maxVal = d3.max(data, function(d) { return d.amount; });
    var radiusScale = d3.scale.sqrt().domain([0, maxVal]).range([10, 20]);

    data.forEach(function(d) {
        var y = radiusScale(d.amount);
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
            y: -y
        };

        nodes.push(node);
    });

    force = d3.layout.force().nodes(nodes).size([w, h]);

    return start();
}

function start() {
    node = nodeGroup.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function(d) { return "node " + d.party; })
            .attr("amount", function(d) { return d.value; })
            .attr("donor", function(d) { return d.donor; })
            .attr("entity", function(d) { return d.entity; })
            .attr("party", function(d) { return d.party; })
            // disabled because of slow Firefox SVG rendering
            // though I admit I'm asking a lot of the browser and cpu with the number of nodes
            //.style("opacity", 0.9)
            .attr("r", 0)
            .style("fill", function(d) { return fill(d.party); })
            .style("left", 30 + "vw")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", click);
            // Alternative title based 'tooltips'
            // node.append("title")
            //.text(function(d) { return d.donor; });

    force.gravity(0)
            .friction(0.75)
            .charge(function(d) { return -Math.pow(d.radius, 2) / 3; })
            .on("tick", all)
            .start();

    //circle build
    node.transition()
            .duration(2500)
            .attr("r", function(d) { return d.radius; });
}

/* ----- Mouse Events on circles  ----- */
function mouseover(d) {
    // tooltip popup
    var mosie = d3.select(this);
    var amount = mosie.attr("amount");
    var offset = $("svg").offset();
    
    var imagePath = "assets/photos/" + d.donor + ".ico";
    /* info box */
    var infoBox = "<p> Source: <b>" + d.donor + "</b> " +  "<span><img src='" + imagePath 
                    + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>"
                    + "<p> Recipient: <b>" + d.partyLabel + "</b></p>"
                    + "<p> Type of donor: <b>" + d.entityLabel + "</b></p>"
                    + "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";
    
    mosie.classed("active", true);

    /* info box apearance */   /* top: ... - 10 (boliko sto mati)*/
    d3.select(".tooltip").style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
      .style("top", ((parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) - 13) + "px").html(infoBox).style("display","block");

    responsiveVoice.speak(":" +d.donor +": with total value :" +comma(amount) +" pounds");
    //addPhotosToHTML(imagePath);
    d3.select("#view-recent-donors").html("<img src='" +imagePath +"'>").style("top", 940 +"px");
}

function click(d) {
    googleSearch(d.donor); 
}

function googleSearch(input) {
    window.open('http://google.com/search?q=' +input);
}

function addPhotosToHTML(imagePath) {
    var tempImage = document.createElement("IMG");
    tempImage.setAttribute("src", imagePath);
    tempImage.width = 100;
    tempImage.height = 100;
    document.body.appendChild(tempImage);
}

function mouseout() {
    // no more tooltips
    var mosie = d3.select(this);
    mosie.classed("active", false);
    d3.select(".tooltip").style("display", "none");
    responsiveVoice.cancel();
}
/* ----- end of: Mouse events on circles ----- */

/* ----- selected mode ----- */
function transition(name) {
    if (name === "all-donations") {
        $("#initial-content").fadeIn(250);
        $("#value-scale").fadeIn(1000);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-by-amount").fadeOut(250);
        return total();
    }
    if (name === "group-by-party") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-party-type").fadeIn(1000);
        $("#view-by-amount").fadeOut(250);
        return partyGroup();
    }
    if (name === "group-by-donor-type") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-donor-type").fadeIn(1000);
        $("#view-by-amount").fadeOut(250);
        return donorType();
    }
    if (name === "group-by-money-source") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeIn(1000);
        $("#view-by-amount").fadeOut(250);
        return fundsType();
    }
    if(name === "group-by-donor-amount") {
        $("#initial-content").fadeOut(250);
        $("#value-scale").fadeOut(250);
        $("#view-donor-type").fadeOut(250);
        $("#view-party-type").fadeOut(250);
        $("#view-source-type").fadeOut(250);
        $("#view-by-amount").fadeIn(1000);
        return donorAmount();
    }
}
/* ----- end of: selected mode ----- */

/* ----- mode: all money ----- */
function total() {
    force.gravity(0)
            .friction(0.9)
            .charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
            .on("tick", all)
            .start();
}

function all(e) {
    node.each(moveToCentre(e.alpha)).each(collide(0.0001));
    node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) {return d.y; });
}

function moveToCentre(alpha) {
    return function(d) {
        var centreX = svgCentre.x + 75;

        if (d.value <= 25001) {
            centreY = svgCentre.y + 75;
        } else if (d.value <= 50001) {
            centreY = svgCentre.y + 55;
        } else if (d.value <= 100001) {
            centreY = svgCentre.y + 35;
        } else  if (d.value <= 500001) {
            centreY = svgCentre.y + 15;
        } else  if (d.value <= 1000001) {
            centreY = svgCentre.y - 5;
        } else  if (d.value <= maxVal) {
            centreY = svgCentre.y - 25;
        } else {
            centreY = svgCentre.y;
        }

        d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
        d.y += (centreY - 100 - d.y) * (brake + 0.06) * alpha * 1.2;
    };
}

// Collision detection function by m bostock
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);

    return function(d) {
        var r = d.radius + radius.domain()[1] + padding, nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;

        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}
/* ----- end of mode: all money ----- */

/* ----- mode: The public's purse ----- */
function fundsType() {
    force.gravity(0)
            .friction(0.75)
            .charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
            .on("tick", types)
            .start();
}

function types(e) {
    node.each(moveToFunds(e.alpha));
    node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) {return d.y; });
}

function moveToFunds(alpha) {
    return function(d) {
        var centreY = entityCentres[d.entity].y;
        var centreX = entityCentres[d.entity].x;

        if (d.entity !== 'pub') {
            centreY = 300;
            centreX = 350;
        } else {
            centreX = entityCentres[d.entity].x + 60;
            centreY = 380;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: The public's purse ----- */

/* ----- mode: split by party ----- */
function partyGroup() {
    force.gravity(0)
            .friction(0.8)
            .charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
            .on("tick", parties)
            .start();
            //.colourByParty();   //colourByParty: not used
}

function parties(e) {
    node.each(moveToParties(e.alpha));
    node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) {return d.y; });
}

function moveToParties(alpha) {
    return function(d) {
        var centreX = partyCentres[d.party].x + 50;

        if (d.entity === 'pub') {
            centreX = 1200;
        } else {
            centreY = partyCentres[d.party].y;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: split by party ----- */

/* ----- mode: split by type of donor ----- */
function donorType() {
    force.gravity(0)
            .friction(0.8)
            .charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
            .on("tick", entities)
            .start();
}

function entities(e) {
    node.each(moveToEnts(e.alpha));
    node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) {return d.y; });
}

function moveToEnts(alpha) {
    return function(d) {
        var centreY = entityCentres[d.entity].y;
        if (d.entity === 'pub') {
            centreX = 1200;
        } else {
            centreX = entityCentres[d.entity].x;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: split by type of donor ----- */

/* ----- split by donor amount ----- */
function donorAmount() {
    force.gravity(0)
            .friction(0.8)
            .charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
            .on("tick", entitiesByAmount)
            .start();
}

function entitiesByAmount(e) {
    node.each(moveByAmount(e.alpha));
    node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) {return d.y; });
}

function moveByAmount(alpha) {
    return function(d) {
        var centreY = entityCentres[d.entity].y;
        var centreX = entityCentres[d.entity].x;
        
        if(d.value >= 0 && d.value <= 100000) {
            centreX = donorAmountPos.first.x;
            centreY = donorAmountPos.first.y;
        }
        if(d.value > 100000 && d.value <= 1000000) {
            centreX = donorAmountPos.second.x;
            centreY = donorAmountPos.second.y;
        }
        if(d.value > 1000000 && d.value <= 20000000) {
            centreX = donorAmountPos.third.x;
            centreY = donorAmountPos.third.y;
        }
        
        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: split by donor amount ----- */

/* "zoom" */
$(document).ready(function() {
  var oldSize = parseFloat($(".content").css('font-size'));
  var newSize = oldSize  * 1.2;
  $(".content").hover( function() {
        $(".content").animate({ fontSize: newSize}, 200);
    }, function() {
        $(".content").animate({ fontSize: oldSize}, 200);
    }
  );
});
/* end of: "zoom" */
