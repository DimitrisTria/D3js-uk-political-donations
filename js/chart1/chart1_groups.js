
var padding = 2;
var force, node, data, maxVal;
var brake = 0.2;

var currentEvent_dct = {
    "all-donations": moveToCentre,
    "group-by-money-source": moveToFunds,
    "group-by-party": moveToParties,
    "group-by-donor-type": moveToEnts,
    "group-by-donor-amount": moveByAmount
};

function total1() {
    force.gravity(0)
        .friction(0.9)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 2.8;
        })
        .on("tick", all1)
        .start();
}

function all1(e) {
    if (currentGroup == group_lst[0]) {
        node.each(currentEvent_dct[currentGroup](e.alpha)).each(collide(0.0001));
    }
    else {
        node.each(currentEvent_dct[currentGroup](e.alpha));
    }
    node.attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
            return d.y;
        });
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

/* ----- All money ----- */
var allMoneyCentres = {
    x: w / 3.6,
    y: h / 2.2
};

function moveToCentre(alpha) {
    var centreY = 0;

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
/* ----- end of: All money ----- */

/* ----- The public's purse ----- */
var publicsPurseCentres = {
    individual: { x: w / 3.65, y: h / 2 },
    society: { x: w / 1.15, y: h / 2 },
    company: { x: w / 3.65, y: h / 2 },
    other: { x: w / 1.15, y: h / 2 },
    union: { x: w / 3.65, y: h / 2 },
    pub: { x: w / 1.75, y: h / 2 } //mode: public's purse
};

function moveToFunds(alpha) {
    return function (d) {
        var centreY = publicsPurseCentres[d.entity].y;
        var centreX = publicsPurseCentres[d.entity].x;

        if (d.entity !== 'pub') {
            centreX = 350;
            centreY = 300;
        } else {
            centreX = publicsPurseCentres[d.entity].x + 60;
            centreY = 375;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ----- end of mode: The public's purse ----- */

/* ----- mode: split by party ----- */
var splitPrivateByPartyCentres = {
    con: { x: w / 3, y: h / 3 },
    lab: { x: w / 3, y: h / 2.2 },
    lib: { x: w / 3, y: h / 1.5 }
};

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
var splitPrivateByTypeOfDonorCentres = {
    individual: { x: w / 3.65, y: h / 3.2 },
    society: { x: w / 1.12, y: h / 3 },
    company: { x: w / 3.65, y: h / 2.1 },
    other: { x: w / 1.15, y: h / 1.7 },
    union: { x: w / 3.65, y: h / 1.5 },
    pub: { x: w / 1.75, y: h / 2.7 }
};

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
var splitByDonorAmountCentres = {
    firstGroup: { x: w / 3.4, y: h / 2.8 },
    secondGroup: { x: w / 2.05, y: h / 2.8 },
    thirdGroup: { x: w / 1.45, y: h / 2.8 }
};

function moveByAmount(alpha) {
    var centreX = 0;
    var centreY = 0;

    return function (d) {
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
