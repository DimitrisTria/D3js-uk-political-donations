
var w = 1000, h = 800;
var nodes = [];
var chart1_svg = d3.select("#chart1_svg");
var chart1_fill = d3.scale.ordinal().range([newColors_lst[0], newColors_lst[1], newColors_lst[2]]); //circles colors (purple-green-cyan)
var maxVal = 0, force = 0;

function chart1Display(data) {
    maxVal = d3.max(data, function (d) { return d.amount; });
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

    node = chart1_svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
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
            return chart1_fill(d.party);
        })
        .on("mouseover", mouseoverCircle)
        .on("mouseout", mouseoutCircle)
        .on("click", clickCircle);

    force.gravity(0).friction(0.75)
        .charge(function (d) {
            return -Math.pow(d.radius, 2) / 3;
        })
        .on("tick", all1)
        .start();

    //circle build
    node.transition().duration(2500).attr("r", function (d) {
        return d.radius;
    });
}
