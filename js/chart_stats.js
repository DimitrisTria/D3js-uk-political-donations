/* ****** svg1_stats ****** */
function calcDonorFreqByCategory(dataset) {
    var grp1_lst = [], grp2_lst = [], grp3_lst = [], grp4_lst = [], grp5_lst = [];
    grp1_lst = grp1_pd(dataset);
    grp2_lst = grp2_pd(dataset);
    grp3_lst = grp3_pd(dataset);
    grp4_lst = grp4_pd(dataset);
    grp5_lst = grp5_pd(dataset);
    temp_lst = [grp1_lst, grp2_lst, grp3_lst, grp4_lst, grp5_lst];
    return temp_lst;
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
    temp_lst = [["0-25000", c1], ["25000-50000", c2], ["50000-100000", c3], ["100000-500000", c4], ["500000-1000000", c5], [">1000000", c6]];
    return temp_lst;
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
    temp_lst = [["private", c1], ["public", c2]];
    return temp_lst;
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
    temp_lst = [["Conservative Party", c1], ["Labour Party", c2], ["Liberal Democrats", c3]];
    return temp_lst;
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
    temp_lst = [["Individual", c1], ["Society", c2], ["Company", c3], ["Individual", c4], ["Trade Union", c5]];
    return temp_lst;
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
    temp_lst = [["0-100000", c1], ["100000-1000000", c2], [">1000000", c3]];
    return temp_lst;
}
/* ****** end of: svg1_stats ****** */
