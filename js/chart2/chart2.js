
var chart2_margin = { top: 350, right: 480, bottom: 350, left: 480 };
var chart2_radius = Math.min(chart2_margin.top, chart2_margin.right, chart2_margin.bottom, chart2_margin.left) - 10;

var hue = d3.scale.category10();
var luminance = d3.scale.sqrt()
    .domain([0, "1e6"])
    .clamp(true)
    .range([70, 200]);

var arc = d3.svg.arc()
    .startAngle(function (d) { return d.x; })
    .endAngle(function (d) { return d.x + d.dx - .01 / (d.depth + .5); })
    .innerRadius(function (d) { return chart2_radius / 3 * d.depth; })
    .outerRadius(function (d) { return chart2_radius / 3 * (d.depth + 1) - 1; });

function checkForDoubleKeys(keyHist, key) {
    for (var i = 0; i < keyHist.length; i++) {
        if (key === keyHist[i]) {
            key = key + ".";
        }
    }
    return key;
}

var keyHist = [];
function key(d) {
    var k = [], p = d;
    while (p.depth) {
        k.push(p.donor);
        p = p.parent;
    }
    var key = k.reverse().join(".");
    key = checkForDoubleKeys(keyHist, key); // :)
    keyHist.push(key);
    return key;
}

function fill(d) {
    while (d.depth > 1) d = d.parent;
    var c = d3.lab(hue(d.donor));
    c.l = luminance(d.amount);
    return c;
}

function chart2Display(group) {
    var root = chart2_dct[group];

    var chart2_svg = d3.select("#chart2_svg")
        .attr("width", chart2_margin.left + chart2_margin.right)
        .attr("height", chart2_margin.top + chart2_margin.bottom)
        .append("g")
        .attr("transform", "translate(" + chart2_margin.left + "," + chart2_margin.top + ")");

    var partition = d3.layout.partition()
        .sort(function (a, b) { return d3.ascending(a.donor, b.donor); })
        .size([2 * Math.PI, chart2_radius]);

    partition
        .value(function (d) { return d.amount; })
        .nodes(root)
        .forEach(function (d) {
            d.sum = d.value;
            d.key = key(d);
            d.fill = fill(d);
        });

    // Now redefine the value function to use the previously-computed sum.
    partition                                       // (1) posa omokentra grafhmata 8a emfanizontai
        .children(function (d, depth) { return depth < 1 ? d.children : null; })
        .value(function (d) { return d.sum; });

    var center = chart2_svg.append("circle")
        .attr("r", chart2_radius / 3.7)
        .style("fill", "rgba(100,100,100,0.3)")
        .on("click", zoomOut)
        .on("mouseover", function () {
            d3.select(this).style("fill", "rgba(100,100,100,0.5)");
        })
        .on("mouseout", function () {
            d3.select(this).style("fill", "rgba(100,100,100,0.3)");
        });

    var partitioned_data = partition.nodes(root).slice(1);

    var path = chart2_svg.selectAll("path")
        .data(partitioned_data)
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d) { return d.fill; })
        .each(function (d) { this._current = updateArc(d); })
        .on("click", zoomIn)
        .on("mouseover", mouseOverArc)
        .on("mousemove", mouseMoveArc)
        .on("mouseout", mouseOutArc);

    var texts = chart2_svg.selectAll("text")
        .data(partitioned_data)
        .enter().append("text")
        .filter(filter_min_arc_size_text)
        .attr("transform", function (d) { return "rotate(" + computeTextRotation(d) + ")"; })
        .attr("x", function (d) { return chart2_radius / 3 * d.depth; })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align	
        .text(function (d) { return d.donor })

    function zoomIn(p) {
        if (p.depth > 1) p = p.parent;
        if (!p.children) {
            googleSearch(p.donor);
            return;
        };
        zoom(p, p);
    }

    function zoomOut(p) {
        if (!p.parent) return;
        zoom(p.parent, p);
    }

    // Zoom to the specified new root.
    function zoom(root, p) {
        if (document.documentElement.__transition__) return;

        // Rescale outside angles to match the new layout.
        var enterArc,
            exitArc,
            outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

        function insideArc(d) {
            return p.key > d.key
                ? { depth: d.depth - 1, x: 0, dx: 0 } : p.key < d.key
                    ? { depth: d.depth - 1, x: 2 * Math.PI, dx: 0 }
                    : { depth: 0, x: 0, dx: 2 * Math.PI };
        }

        function outsideArc(d) {
            return { depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x) };
        }

        center.datum(root);

        // When zooming in, arcs enter from the outside and exit to the inside.
        // Entering outside arcs start from the old layout.
        if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

        var new_data = partition.nodes(root).slice(1)

        path = path.data(new_data, function (d) { return d.key; });

        // When zooming out, arcs enter from the inside and exit to the outside.
        // Exiting outside arcs transition to the new layout.
        if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

        d3.transition().duration(d3.event.altKey ? 2750 : 750).each(function () {
            path.exit().transition()
                .style("fill-opacity", function (d) { return d.depth === 1 + (root === p) ? 1 : 0; })
                .attrTween("d", function (d) { return arcTween.call(this, exitArc(d)); })
                .remove();

            path.enter().append("path")
                .style("fill-opacity", function (d) { return d.depth === 2 - (root === p) ? 1 : 0; })
                .style("fill", function (d) { return d.fill; })
                .on("click", zoomIn)
                .on("mouseover", mouseOverArc)
                .on("mousemove", mouseMoveArc)
                .on("mouseout", mouseOutArc)
                .each(function (d) { this._current = enterArc(d); });


            path.transition()
                .style("fill-opacity", 1)
                .attrTween("d", function (d) { return arcTween.call(this, updateArc(d)); });
        });

        texts = texts.data(new_data, function (d) { return d.key; });
        texts.exit().remove();

        texts.enter().append("text");
        texts.style("opacity", 0)
            .attr("transform", function (d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function (d) { return chart2_radius / 3 * d.depth; })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .filter(filter_min_arc_size_text)
            .text(function (d, i) { return d.donor; })
            .transition().delay(d3.event.altKey ? 2750 : 750).style("opacity", 1);
    }
}

function arcTween(b) {
    var i = d3.interpolate(this._current, b);
    this._current = i(0);
    return function (t) {
        return arc(i(t));
    };
}

function updateArc(d) {
    return { depth: d.depth, x: d.x, dx: d.dx };
}

function filter_min_arc_size_text(d, i) {
    return (d.dx * d.depth * chart2_radius / 4) > 14;
}

function computeTextRotation(d) {
    var angle = (d.x + d.dx / 2) * 180 / Math.PI - 90;
    return angle;
}

d3.select(self.frameElement).style("height", chart2_margin.top + chart2_margin.bottom + "px");
