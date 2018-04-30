/* *** data of chart2 and stats_chart1 *** */
var chart2_lst = [], chart2_dct = {};
var stats_chart1_lst = [], stats_chart1_dct = {};
d3.csv("assets/data/7500up.csv", function (error, data) {
    if (error) return console.warn(error);

    //data of chart2
    chart2_lst = csvToJson(data);
    chart2_dct = {
        "all-donations": chart2_lst[0],
        "group-by-money-source": chart2_lst[1],
        "group-by-party": chart2_lst[2], "group-by-donor-type": chart2_lst[3],
        "group-by-donor-amount": chart2_lst[4]
    };

    //data of stats_chart1
    stats_chart1_lst = calcStats1(data);
    stats_chart1_dct = {
        "all-donations": stats_chart1_lst[0],
        "group-by-money-source": stats_chart1_lst[1],
        "group-by-party": stats_chart1_lst[2],
        "group-by-donor-type": stats_chart1_lst[3],
        "group-by-donor-amount": stats_chart1_lst[4]
    };
});
/* *** end of: data of chart2 and stats_chart1 *** */
