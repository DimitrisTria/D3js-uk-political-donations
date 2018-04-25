
function csvToJson(data) {
    var temp_lst = [chart2_grp1_pd(data), chart2_grp2_pd(data), chart2_grp3_pd(data), chart2_grp4_pd(data), chart2_grp5_pd(data)];
    for (var i = 0; i < temp_lst; i++) {
        temp_lst[i] = JSON.stringify(temp_lst[i]); // 0 gia to prwto group
    }
    return temp_lst;
}

function chart2_grp1_pd(dataset) {
    var l1 = [], l2 = [], l3 = [], l4 = [], l5 = [], l6 = [];
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].amount >= 0 && dataset[i].amount <= 25000) {
            l1.push(dataset[i]);
        }
        else if (dataset[i].amount > 25000 && dataset[i].amount <= 50000) {
            l2.push(dataset[i]);
        }
        else if (dataset[i].amount > 50000 && dataset[i].amount <= 100000) {
            l3.push(dataset[i]);
        }
        else if (dataset[i].amount > 100000 && dataset[i].amount <= 500000) {
            l4.push(dataset[i]);
        }
        else if (dataset[i].amount > 500000 && dataset[i].amount <= 1000000) {
            l5.push(dataset[i]);
        }
        else if (dataset[i].amount > 1000000) {
            l6.push(dataset[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root", // json root
        amount: dataset.length, // number of total donors
        children: [
            {
                donor: "0-25000", // group's name
                amount: l1.length, // number of donors in group
                children: l1 // actual data here
            },
            {
                donor: "25000-50000",
                amount: l2.length,
                children: l2
            },
            {
                donor: "50000-100000",
                amount: l3.length,
                children: l3
            },
            {
                donor: "100000-500000",
                amount: l4.length,
                children: l4
            },
            {
                donor: "500000-1000000",
                amount: l5.length,
                children: l5
            },
            {
                donor: ">1000000",
                amount: l6.length,
                children: l6
            },
        ]
    };
    return chart2_svg_obj;
}

function chart2_grp2_pd(dataset) {
    var l1 = [], l2 = [];
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].entity != "pub") {
            l1.push(dataset[i]);
        }
        else {
            l2.push(dataset[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: dataset.length,
        children: [
            {
                donor: "private",
                amount: l1.length,
                children: l1
            },
            {
                donor: "public",
                amount: l2.length,
                children: l2
            }
        ]
    };
    return chart2_svg_obj;
}

function chart2_grp3_pd(dataset) {
    var l1 = [], l2 = [], l3 = [];
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].party == "con") {
            l1.push(dataset[i]);
        }
        if (dataset[i].party == "lab") {
            l2.push(dataset[i]);
        }
        if (dataset[i].party == "lib") {
            l3.push(dataset[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: dataset.length,
        children: [
            {
                donor: "Conservative Party",
                amount: l1.length,
                children: l1
            },
            {
                donor: "Labour Party",
                amount: l2.length,
                children: l2
            },
            {
                donor: "Liberal Democrats",
                amount: l3.length,
                children: l3
            }
        ]
    };
    return chart2_svg_obj;
}

function chart2_grp4_pd(dataset) {
    var categ_lst = ["Individual", "Society", "Company", "Other", "Trade Union"];
    var l1 = [], l2 = [], l3 = [], l4 = [], l5 = [];
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].entityname == categ_lst[0]) {
            l1.push(dataset[i]);
        }
        if (dataset[i].entityname == categ_lst[1]) {
            l2.push(dataset[i]);
        }
        if (dataset[i].entityname == categ_lst[2]) {
            l3.push(dataset[i]);
        }
        if (dataset[i].entityname == categ_lst[3]) {
            l4.push(dataset[i]);
        }
        if (dataset[i].entityname == categ_lst[4]) {
            l5.push(dataset[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: dataset.length,
        children: [
            {
                donor: categ_lst[0],
                amount: l1.length,
                children: l1
            },
            {
                donor: categ_lst[1],
                amount: l2.length,
                children: l2
            },
            {
                donor: categ_lst[2],
                amount: l3.length,
                children: l3
            },
            {
                donor: categ_lst[3],
                amount: l4.length,
                children: l4
            },
            {
                donor: categ_lst[4],
                amount: l5.length,
                children: l5
            }
        ]
    };
    return chart2_svg_obj;
}

function chart2_grp5_pd(dataset) {
    var l1 = [], l2 = [], l3 = [];
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].amount >= 0 && dataset[i].amount <= 100000) {
            l1.push(dataset[i]);
        }
        if (dataset[i].amount > 100000 && dataset[i].amount <= 1000000) {
            l2.push(dataset[i]);
        }
        if (dataset[i].amount > 1000000) {
            l3.push(dataset[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: dataset.length,
        children: [
            {
                donor: "0-100000",
                amount: l1.length,
                children: l1
            },
            {
                donor: "100000-1000000",
                amount: l2.length,
                children: l2
            },
            {
                donor: ">1000000",
                amount: l3.length,
                children: l3
            }
        ]
    };
    return chart2_svg_obj;
}
