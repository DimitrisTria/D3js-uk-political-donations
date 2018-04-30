
function calcStats1(data) {
    var result_lst = [stats1_grp1(data), stats1_grp2(data), stats1_grp3(data), stats1_grp4(data), stats1_grp5(data)];
    return result_lst;
}

function stats1_grp1(data) {
    var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].amount >= 0 && data[i].amount <= 25000) {
            c1 = c1 + 1;
        }
        else if (data[i].amount > 25000 && data[i].amount <= 50000) {
            c2 = c2 + 1;
        }
        else if (data[i].amount > 50000 && data[i].amount <= 100000) {
            c3 = c3 + 1;
        }
        else if (data[i].amount > 100000 && data[i].amount <= 500000) {
            c4 = c4 + 1;
        }
        else if (data[i].amount > 500000 && data[i].amount <= 1000000) {
            c5 = c5 + 1;
        }
        else if (data[i].amount > 1000000) {
            c6 = c6 + 1;
        }
    }
    var temp_lst = [["0-25000", c1], ["25000-50000", c2], ["50000-100000", c3], ["100000-500000", c4], ["500000-1000000", c5], [">1000000", c6]];
    return temp_lst;
}

function stats1_grp2(data) {
    var c1 = 0, c2 = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].entity != "pub") {
            c1 = c1 + 1;
        }
        else {
            c2 = c2 + 1;
        }
    }
    var temp_lst = [["private", c1], ["public", c2]];
    return temp_lst;
}

function stats1_grp3(data) {
    var c1 = 0, c2 = 0, c3 = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].party == "con") {
            c1 = c1 + 1;
        }
        if (data[i].party == "lab") {
            c2 = c2 + 1;
        }
        if (data[i].party == "lib") {
            c3 = c3 + 1;
        }
    }
    var temp_lst = [["Conservative Party", c1], ["Labour Party", c2], ["Liberal Democrats", c3]];
    return temp_lst;
}

function stats1_grp4(data) {
    var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].entityname == "Individual") {
            c1 = c1 + 1;
        }
        if (data[i].entityname == "Society") {
            c2 = c2 + 1;
        }
        if (data[i].entityname == "Company") {
            c3 = c3 + 1;
        }
        if (data[i].entityname == "Other") {
            c4 = c4 + 1;
        }
        if (data[i].entityname == "Trade Union") {
            c5 = c5 + 1;
        }
    }
    var temp_lst = [["Individuals", c1], ["Societies", c2], ["Companies", c3], ["Others", c4], ["Trade Unions", c5]];
    return temp_lst;
}

function stats1_grp5(data) {
    var c1 = 0, c2 = 0, c3 = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].amount >= 0 && data[i].amount <= 100000) {
            c1 = c1 + 1;
        }
        if (data[i].amount > 100000 && data[i].amount <= 1000000) {
            c2 = c2 + 1;
        }
        if (data[i].amount > 1000000) {
            c3 = c3 + 1;
        }
    }
    var temp_lst = [["0-100000", c1], ["100000-1000000", c2], [">1000000", c3]];
    return temp_lst;
}
