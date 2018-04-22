d3.csv("assets/data/7500up.csv", function (error, data) {
    if (error) return console.log(error);
    // csvToJson(data);
});

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

function key(d) {
    var k = [], p = d;
    while (p.depth) {
        k.push(p.donor);
        p = p.parent;
    }
    return k.reverse().join(".");
}

function fill(d) {
    while (d.depth > 1) d = d.parent;
    var c = d3.lab(hue(d.donor));
    c.l = luminance(d.amount);
    return c;
}

function chart2Display(fileName) {
    d3.json("assets/data/chart2_groups/" + fileName + ".json", function (error, root) {
        if (error) return console.warn(error);
        // Compute the initial layout on the entire tree to sum sizes.
        // Also compute the full name and fill color for each node,
        // and stash the children so they can be restored as we descend.

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
            .attr("r", chart2_radius / 3)
            .on("click", zoomOut);

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
        }
    });
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

d3.select(self.frameElement).style("height", chart2_margin.top + chart2_margin.bottom + "px");
