/* ****** svg ****** */
var padding = 2;    //?
var force, node, data, maxVal;
var brake = 0.2;    //clicking tabs

var allMoneyCentres = {
    x: w / 3.6,
    y: h / 2
};

var publicsPurseCentres = {
    individual: { x: w / 3.65, y: h / 2 },
    society: { x: w / 1.15, y: h / 2 },
    company: { x: w / 3.65, y: h / 2 },
    other: { x: w / 1.15, y: h / 2 },
    union: { x: w / 3.65, y: h / 2 },
    pub: { x: w / 1.75, y: h / 2 } //mode: public's purse
};

var splitPrivateByPartyCentres = {
    con: { x: w / 3, y: h / 3.2 },
    lab: { x: w / 3, y: h / 2.2 },
    lib: { x: w / 3, y: h / 1.7 }
};

var splitPrivateByTypeOfDonorCentres = {
    individual: { x: w / 3.65, y: h / 3.2 },
    society: { x: w / 1.12, y: h / 3 },
    company: { x: w / 3.65, y: h / 2.1 },
    other: { x: w / 1.15, y: h / 1.7 },
    union: { x: w / 3.65, y: h / 1.5 },
    pub: { x: w / 1.75, y: h / 2.7 }
};

var splitByDonorAmountCentres = {
    firstGroup: { x: w / 3.4, y: h / 2.9 },
    secondGroup: { x: w / 2.05, y: h / 2.9 },
    thirdGroup: { x: w / 1.45, y: h / 2.9 }
};

/* ----- mode: all money ----- */
function total() {
    force.gravity(0)
        .friction(0.9)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 2.8;
        })
        .on("tick", all)
        .start();
}

function all(e) {
    node.each(moveToCentre(e.alpha)).each(collide(0.0001));
    node.attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
}

function moveToCentre(alpha) {
    return function (d) {
        var centreX = allMoneyCentres.x + 75;

        if (d.value <= 25001) {
            centreY = allMoneyCentres.y + 75;
        } else if (d.value <= 50001) {
            centreY = allMoneyCentres.y + 55;
        } else if (d.value <= 100001) {
            centreY = allMoneyCentres.y + 35;
        } else if (d.value <= 500001) {
            centreY = allMoneyCentres.y + 15;
        } else if (d.value <= 1000001) {
            centreY = allMoneyCentres.y - 5;
        } else if (d.value <= maxVal) {
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

    return function (d) {
        var r = d.radius + radius.domain()[1] + padding, nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;

        quadtree.visit(function (quad, x1, y1, x2, y2) {
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
        .charge(function (d) {
            return -Math.pow(d.radius, 2.0) / 3;
        })
        .on("tick", types)
        .start();
}

function types(e) {
    node.each(moveToFunds(e.alpha));
    node.attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
}

function moveToFunds(alpha) {
    return function (d) {
        var centreY = publicsPurseCentres[d.entity].y;
        var centreX = publicsPurseCentres[d.entity].x;

        if (d.entity !== 'pub') {
            centreX = 350;
            centreY = 280;
        } else {
            centreX = publicsPurseCentres[d.entity].x + 60;
            centreY = 360;
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
        .charge(function (d) {
            return -Math.pow(d.radius, 2.0) / 3;
        })
        .on("tick", parties)
        .start();
    //.colourByParty();   //colourByParty: not used
}

function parties(e) {
    node.each(moveToParties(e.alpha));
    node.attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
}

function moveToParties(alpha) {
    return function (d) {
        var centreX = splitPrivateByPartyCentres[d.party].x + 50;
        var centreY = splitPrivateByTypeOfDonorCentres[d.entity].y;

        if (d.entity === 'pub') {
            centreX = 1200;
        } else {
            centreY = splitPrivateByPartyCentres[d.party].y;
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
        .charge(function (d) {
            return -Math.pow(d.radius, 2.0) / 3;
        })
        .on("tick", entities)
        .start();
}

function entities(e) {
    node.each(moveToEnts(e.alpha));
    node.attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
}

function moveToEnts(alpha) {
    return function (d) {
        var centreX = splitPrivateByTypeOfDonorCentres[d.entity].x;
        var centreY = splitPrivateByTypeOfDonorCentres[d.entity].y;

        if (d.entity === 'pub') {
            centreX = 1200;
        } else {
            centreX = splitPrivateByTypeOfDonorCentres[d.entity].x;
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
        .charge(function (d) {
            return -Math.pow(d.radius, 2.0) / 3;
        })
        .on("tick", entitiesByAmount)
        .start();
}

function entitiesByAmount(e) {
    node.each(moveByAmount(e.alpha));
    node.attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
}

function moveByAmount(alpha) {
    return function (d) {
        var centreX = splitPrivateByTypeOfDonorCentres[d.entity].x;
        var centreY = splitPrivateByTypeOfDonorCentres[d.entity].y;

        if (d.value >= 0 && d.value <= 100000) {
            centreX = splitByDonorAmountCentres.firstGroup.x;
            centreY = splitByDonorAmountCentres.firstGroup.y;
        }
        if (d.value > 100000 && d.value <= 1000000) {
            centreX = splitByDonorAmountCentres.secondGroup.x;
            centreY = splitByDonorAmountCentres.secondGroup.y;
        }
        if (d.value > 1000000) {
            centreX = splitByDonorAmountCentres.thirdGroup.x;
            centreY = splitByDonorAmountCentres.thirdGroup.y;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: split by donor amount ----- */
/* ****** end of: svg ****** */


/* ****** mysvg ****** */
function calcDonorFreqByCategory(dataset) {
    var grp1_lst = [], grp2_lst = [], grp3_lst = [], grp4_lst = [], grp5_lst = [];
    grp1_lst = grp1_pd(dataset);
    grp2_lst = grp2_pd(dataset);
    grp3_lst = grp3_pd(dataset);
    grp4_lst = grp4_pd(dataset);
    grp5_lst = grp5_pd(dataset);
    list = [grp1_lst, grp2_lst, grp3_lst, grp4_lst, grp5_lst];
    return list;
}

function grp1_pd(dataset) {
    var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].amount >= 0 && dataset[i].amount <= 25000) {
            c1 = c1 + 1;
        }
        else if (dataset[i].amount > 25000 && dataset[i].amount <= 50000) {
            c2 = c2 + 1;
        }
        else if (dataset[i].amount > 50000 && dataset[i].amount <= 100000) {
            c3 = c3 + 1;
        }
        else if (dataset[i].amount > 100000 && dataset[i].amount <= 500000) {
            c4 = c4 + 1;
        }
        else if (dataset[i].amount > 500000 && dataset[i].amount <= 1000000) {
            c5 = c5 + 1;
        }
        else if (dataset[i].amount > 1000000) {
            c6 = c6 + 1;
        }
    }

    list = [["0-25000", c1], ["25000-50000", c2], ["50000-100000", c3], ["100000-500000", c4], ["500000-1000000", c5], [">1000000", c6]];
    return list;
}

function grp2_pd(dataset) {
    var c1 = 0, c2 = 0;
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].entity != "pub") {
            c1 = c1 + 1;
        }
        else {
            c2 = c2 + 1;
        }
    }
    list = [ ["private", c1], ["public", c2] ];
    return list;
}

function grp3_pd(dataset) {
    var c1 = 0, c2 = 0, c3 = 0;
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].party == "con") {
            c1 = c1 + 1;
        }
        if (dataset[i].party == "lab") {
            c2 = c2 + 1;
        }
        if (dataset[i].party == "lib") {
            c3 = c3 + 1;
        }
    }
    list = [["Conservative Party", c1], ["Labour Party", c2], ["Liberal Democrats", c3]];
    return list;
}

function grp4_pd(dataset) {
    var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].entityname == "Individual") {
            c1 = c1 + 1;
        }
        if (dataset[i].entityname == "Society") {
            c2 = c2 + 1;
        }
        if (dataset[i].entityname == "Company") {
            c3 = c3 + 1;
        }
        if (dataset[i].entityname == "Individual") {
            c4 = c4 + 1;
        }
        if (dataset[i].entityname == "Trade Union") {
            c5 = c5 + 1;
        }
    }
    list = [["Individual", c1], ["Society", c2], ["Company", c3], ["Individual", c4], ["Trade Union", c5]];
    return list;
}

function grp5_pd(dataset) {
    var c1 = 0, c2 = 0, c3 = 0;
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].amount >= 0 && dataset[i].amount <= 100000) {
            c1 = c1 + 1;
        }
        if (dataset[i].amount > 100000 && dataset[i].amount <= 1000000) {
            c2 = c2 + 1;
        }
        if (dataset[i].amount > 1000000) {
            c3 = c3 + 1;
        }
    }
    list = [["0-100000", c1], ["100000-1000000", c2], [">1000000", c3]];
    return list;
}
/* ****** end of: mysvg ****** */
