/* global d3, w, nodes, h, nodeGroup, all, sizeOfImageHistoryBar, listOfImageHistoryBar, responsiveVoice */

/* ----- event handler ----- */
$(document).ready(function() {
    d3.selectAll(".switch").on("click", function() {
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
/* ----- end of: event mode ----- */

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
            .on("mouseover", mouseoverCircle)
            .on("mouseout", mouseoutCircle)
            .on("click", clickCircle);
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

/* ----- Mouse events (on circles)  ----- */
function mouseoverCircle(d) {
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
    //addImagesToHistoryBar(imagePath);
}

function mouseoutCircle() {
    /* no more tooltips */
    var mosie = d3.select(this);
    mosie.classed("active", false);
    d3.select(".tooltip").style("display", "none"); /* */
    
    responsiveVoice.cancel();
}

function clickCircle(d) {
    googleSearch(d.donor);
}
/* ----- end of: Mouse events (on circles) ----- */

/* search with google */
function googleSearch(input) {
    window.open('http://google.com/search?q=' +input);
}
/* end of: search with google */

/* image history bar */
function addImagesToHistoryBar(imagePath) {
    var newImg = document.createElement("IMG");
    var imgNode = new Image(50,50);
    imgNode.src = imagePath;
    newImg.appendChild(imgNode);
    
    if(imageHistoryBarCounter >= sizeOfImageHistoryBar) {
        listOfImageHistoryBar.removeChild(listOfImageHistoryBar.childNodes[sizeOfImageHistoryBar-1]); //remove last image
    }
    else {
        imageHistoryBarCounter=imageHistoryBarCounter+1;
    }
    
    listOfImageHistoryBar.insertBefore(imgNode, listOfImageHistoryBar.childNodes[0]); //append new at begin
}
/* end of: image history bar */

/* "zoom" */
$(document).ready(function() {
  var oldSize = parseFloat($(".content").css('font-size'));
  var newSize = oldSize  * 1.15;
  $(".content").hover( function() {
        $(".content").animate({ fontSize: newSize}, 200);
    }, function() {
        $(".content").animate({ fontSize: oldSize}, 200);
    }
  );
});
/* end of: "zoom" */
