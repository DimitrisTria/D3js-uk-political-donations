
var currentEvent = { "group-all": new_group1, "group-by-geographic-area": new_group2, "group-by-region": new_group3, "group-by-category-of-use":new_group4 };

var padding = 2;
var force, node, data, maxVal;
var brake = 0.2;

function new_total() {
    force.gravity(0)
        .friction(0.9)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 2.8;
        })
        .on("tick", new_all)
        .start();
}

function new_all(e) {
    if (currentGroup == group_lst[0]) {
        node.each(currentEvent[currentGroup](e.alpha)).each(collide(0.07));
    }
    else {
        node.each(currentEvent[currentGroup](e.alpha));
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

/* actual groups */

function new_group1(alpha) {
    var centreX = 300;
    var centreY = 300;

    return function (d) {
        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}

function new_group2(alpha) {
    var centreX = 0;
    var centreY = 300;

    return function (d) {
        if (d.geographic_area == "Northern Greece") {
            centreX = 200;
        }
        if (d.geographic_area == "Central Greece") {
            centreX = 450;
        }
        if (d.geographic_area == "Attiki") {
            centreX = 750;
        }
        if (d.geographic_area == "Aegean Islands-Kriti") {
            centreX = 1000;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}

function new_group3(alpha) {
    var centreX = 0;
    var centreY = 0;

    return function (d) {
        if (d.region == "Eastern Macedonia and Thraki") {
            centreX = 200;
            centreY = 150;
        }
        if (d.region == "Central Macedonia") {
            centreX = 450;
            centreY = 150;
        }
        if (d.region == "Western Macedonia") {
            centreX = 750;
            centreY = 150;
        }
        if (d.region == "Thessalia") {
            centreX = 1000;
            centreY = 150;
        }
        if (d.region == "Ipiros") {
            centreX = 200;
            centreY = 325;
        }
        if (d.region == "Ionian Islands") {
            centreX = 400;
            centreY = 325;
        }
        if (d.region == "Western Greece") {
            centreX = 600;
            centreY = 325;
        }
        if (d.region == "Central Greece") {
            centreX = 800;
            centreY = 325;
        }
        if (d.region == "Peloponnissos") {
            centreX = 1000;
            centreY = 325;
        }
        if (d.region == "Attiki") {
            centreX = 200;
            centreY = 500;
        }
        if (d.region == "Islands of Northern Egeo") {
            centreX = 450;
            centreY = 500;
        }
        if (d.region == "Islands of Southern Egeo") {
            centreX = 750;
            centreY = 500;
        }
        if (d.region == "Kriti") {
            centreX = 1000;
            centreY = 500;
        }
        

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}

function new_group4(alpha) {
    var centreX = 0;
    var centreY = 0;

    return function (d) {
        if (d.total >= 0 && d.total <= 1000000) {
            centreX = 350;
            centreY = 300;
        }
        else {
            centreX = 400;
            centreY = 400;
        }

        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}

/* end of: actual groups */
