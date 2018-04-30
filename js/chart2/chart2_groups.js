
function csvToJson(data) {
    var temp_lst = [chart2_grp1(data), chart2_grp2(data), chart2_grp3(data), chart2_grp4(data), chart2_grp5(data)];
    for (var i = 0; i < temp_lst; i++) {
        temp_lst[i] = JSON.stringify(temp_lst[i]); // 0 gia to prwto group
    }
    return temp_lst;
}

function chart2_grp1(data) {
    var l1 = [], l2 = [], l3 = [], l4 = [], l5 = [], l6 = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].amount >= 0 && data[i].amount <= 25000) {
            l1.push(data[i]);
        }
        else if (data[i].amount > 25000 && data[i].amount <= 50000) {
            l2.push(data[i]);
        }
        else if (data[i].amount > 50000 && data[i].amount <= 100000) {
            l3.push(data[i]);
        }
        else if (data[i].amount > 100000 && data[i].amount <= 500000) {
            l4.push(data[i]);
        }
        else if (data[i].amount > 500000 && data[i].amount <= 1000000) {
            l5.push(data[i]);
        }
        else if (data[i].amount > 1000000) {
            l6.push(data[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root", // json root
        amount: data.length, // number of total donors
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

function chart2_grp2(data) {
    var l1 = [], l2 = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].entity != "pub") {
            l1.push(data[i]);
        }
        else {
            l2.push(data[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: data.length,
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

function chart2_grp3(data) {
    var l1 = [], l2 = [], l3 = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].party == "con") {
            l1.push(data[i]);
        }
        if (data[i].party == "lab") {
            l2.push(data[i]);
        }
        if (data[i].party == "lib") {
            l3.push(data[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: data.length,
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

function chart2_grp4(data) {
    var l1 = [], l2 = [], l3 = [], l4 = [], l5 = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].entityname == "Individual") {
            l1.push(data[i]);
        }
        if (data[i].entityname == "Society") {
            l2.push(data[i]);
        }
        if (data[i].entityname == "Company") {
            l3.push(data[i]);
        }
        if (data[i].entityname == "Other") {
            l4.push(data[i]);
        }
        if (data[i].entityname == "Trade Union") {
            l5.push(data[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: data.length,
        children: [
            {
                donor: "Individuals",
                amount: l1.length,
                children: l1
            },
            {
                donor: "Societies",
                amount: l2.length,
                children: l2
            },
            {
                donor: "Companies",
                amount: l3.length,
                children: l3
            },
            {
                donor: "Others",
                amount: l4.length,
                children: l4
            },
            {
                donor: "Trade Unions",
                amount: l5.length,
                children: l5
            }
        ]
    };
    return chart2_svg_obj;
}

function chart2_grp5(data) {
    var l1 = [], l2 = [], l3 = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].amount >= 0 && data[i].amount <= 100000) {
            l1.push(data[i]);
        }
        if (data[i].amount > 100000 && data[i].amount <= 1000000) {
            l2.push(data[i]);
        }
        if (data[i].amount > 1000000) {
            l3.push(data[i]);
        }
    }

    var chart2_svg_obj = {
        donor: "root",
        amount: data.length,
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
