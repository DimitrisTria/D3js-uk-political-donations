/* global d3 */

var w = 1000, h = 900;  //window (svg) size for circles
var nodes = [];

var svg = d3.select("#chart").append("svg").attr("id", "svg").attr("width", w).attr("height", h);
var nodeGroup = svg.append("g");
var tooltip = d3.select("#chart").append("div").attr("class", "tooltip").attr("id", "tooltip");
var radius = d3.scale.sqrt().range([10, 20]);
var fill = d3.scale.ordinal().range(["#CC0066", "#00CC66", "#00FFCC"]); //circles colors (green-purple-cyan)
var comma = d3.format(",.0f");

var sizeOfImageHistoryBar = 10;
var imageHistoryBarCounter=0;
var listOfImageHistoryBarElement = document.getElementById("view-donor-image-history-bar");
var donorsNameElement = document.getElementById("view-donors-name");
