
var groupEvent_dct = {
    "group-all": group1_2_1,
    "group-by-geographic-area": group1_2_2,
    "group-by-region": group1_2_3,
    "group-by-category-of-use": group1_2_4
};

var padding = 2;
var force, node, data, maxVal;
var brake = 0.2;
var centreX = 0;
var centreY = 0;

function total1_2() {
    force.gravity(0)
        .friction(0.9)
        .charge(function (d) { return -Math.pow(d.radius, 2) / 2.8; })
        .on("tick", all1_2)
        .start();
}

function all1_2(e) {
    if (currentGroup === group_lst[0]) {
        node.each(groupEvent_dct[currentGroup](e.alpha)).each(collide(0.07));
    }
    else {
        node.each(groupEvent_dct[currentGroup](e.alpha));
    }
    node.attr("cx", function (d) { return d.x; }).attr("cy", function (d) { return d.y; });
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

/* ------ group1_2_1 ------ */
var all_dct = {
    "": { x: 250, y: 250 }
};

function group1_2_1(alpha) {
    return function (d) {
        centreX = all_dct[""].x;
        centreY = all_dct[""].y;
        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ------ group1_2_1 ------ */

/* ------ group1_2_2 ------ */
var geographic_area_dct = {
    "Northern Greece": { x: 200, y: 250 },
    "Central Greece": { x: 450, y: 250 },
    "Attiki": { x: 750, y: 250 },
    "Aegean Islands-Kriti": { x: 1000, y: 250 }
};

function group1_2_2(alpha) {
    return function (d) {
        centreX = geographic_area_dct[d.geographic_area].x;
        centreY = geographic_area_dct[d.geographic_area].y;
        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ------ group1_2_2 ------ */

/* ------ group1_2_3 ------ */
var region_dct = {
    "Eastern Macedonia and Thraki": { x: 200, y: 150 },
    "Central Macedonia": { x: 450, y: 150 },
    "Western Macedonia": { x: 750, y: 150 },
    "Thessalia": { x: 1000, y: 150 },
    "Ipiros": { x: 200, y: 325 },
    "Ionian Islands": { x: 400, y: 325 },
    "Western Greece": { x: 600, y: 325 },
    "Central Greece": { x: 800, y: 325 },
    "Peloponnissos": { x: 1000, y: 325 },
    "Attiki": { x: 200, y: 500 },
    "Islands of Northern Egeo": { x: 400, y: 500 },
    "Islands of Southern Egeo": { x: 750, y: 500 },
    "Kriti": { x: 1000, y: 500 }
};

function group1_2_3(alpha) {
    return function (d) {
        centreX = region_dct[d.region].x;
        centreY = region_dct[d.region].y;
        d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
        d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
    };
}
/* ------ end of: group1_2_3 ------ */

function group1_2_4(alpha) {
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
