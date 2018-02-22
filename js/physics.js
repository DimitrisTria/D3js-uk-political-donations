/* global w, h, d3, nodes, radius */

var padding = 2;    //?
var force, node, data, maxVal;
var brake = 0.2;    //when clicking tabs

var allMoneyCentres = {
    x: w / 3.6,
    y: h / 2
};

var splitByPartyCentres = {
    con: { x: w / 3, y: h / 3.3},
    lab: {x: w / 3, y: h / 2.3},
    lib: {x: w / 3, y: h / 1.8}
};

var splitByTypeOfDonorCentres = {
    company: {x: w / 3.65, y: h / 2.3},
    union: {x: w / 3.65, y: h / 1.8},
    other: {x: w / 1.15, y: h / 1.9},
    society: {x: w / 1.12, y: h  / 3.2 },
    pub: {x: w / 1.8, y: h / 2.8},
    individual: {x: w / 3.65, y: h / 3.3}
};

var splitByDonorAmountCentres = {
    firstGroup: {x: 300, y: 270},
    secondGroup: {x: 500, y: 270},
    thirdGroup: {x: 700, y: 270}
};

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
        var centreX = allMoneyCentres.x + 75;

        if (d.value <= 25001) {
            centreY = allMoneyCentres.y + 75;
        } else if (d.value <= 50001) {
            centreY = allMoneyCentres.y + 55;
        } else if (d.value <= 100001) {
            centreY = allMoneyCentres.y + 35;
        } else  if (d.value <= 500001) {
            centreY = allMoneyCentres.y + 15;
        } else  if (d.value <= 1000001) {
            centreY = allMoneyCentres.y - 5;
        } else  if (d.value <= maxVal) {
            centreY = allMoneyCentres.y - 25;
        } else {
            centreY = allMoneyCentres.y;
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
        var centreY = splitByTypeOfDonorCentres[d.entity].y;
        var centreX = splitByTypeOfDonorCentres[d.entity].x;

        if (d.entity !== 'pub') {
            centreY = 300;
            centreX = 350;
        } else {
            centreX = splitByTypeOfDonorCentres[d.entity].x + 60;
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
        var centreX = splitByPartyCentres[d.party].x + 50;

        if (d.entity === 'pub') {
            centreX = 1200;
        } else {
            centreY = splitByPartyCentres[d.party].y;
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
        var centreY = splitByTypeOfDonorCentres[d.entity].y;
        if (d.entity === 'pub') {
            centreX = 1200;
        } else {
            centreX = splitByTypeOfDonorCentres[d.entity].x;
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
        var centreY = splitByTypeOfDonorCentres[d.entity].y;
        var centreX = splitByTypeOfDonorCentres[d.entity].x;
        
        if(d.value >= 0 && d.value <= 100000) {
            centreX = splitByDonorAmountCentres.firstGroup.x;
            centreY = splitByDonorAmountCentres.firstGroup.y;
        }
        if(d.value > 100000 && d.value <= 1000000) {
            centreX = splitByDonorAmountCentres.secondGroup.x;
            centreY = splitByDonorAmountCentres.secondGroup.y;
        }
        if(d.value > 1000000 && d.value <= 20000000) {
            centreX = splitByDonorAmountCentres.thirdGroup.x;
            centreY = splitByDonorAmountCentres.thirdGroup.y;
        }
        
        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: split by donor amount ----- */