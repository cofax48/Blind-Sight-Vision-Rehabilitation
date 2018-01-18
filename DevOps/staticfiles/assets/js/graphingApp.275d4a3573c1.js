var aPIROOT = 'http://localhost:5000/';
var userName = 'Josh_Schenkein';
var testDate = '09-12-2017';
var trialNum = '6';

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

console.log('yao');
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleLinear()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.X); })
    .y(function(d) { return y(d.Y); });

var userData = [{'X':0, 'Y':0}];

d3.json('http://localhost:5000/' + "tableApi" + userName + '/' + testDate + '/' + trialNum, function(error, incomingData) {
  for (var i in incomingData) {
    if (incomingData[i][1] == null) {
      userData.push({X:0, Y:0});
    }
    else if (incomingData[i][2] == null) {
      userData.push({X:0, Y:0});
    }
    else if (incomingData[i][1] == NaN) {
      userData.push({X:0, Y:0});
    }
    else if (incomingData[i][2] == NaN) {
      userData.push({X:0, Y:0});
    }
    else {
      userData.push({X:Number(incomingData[i][1]), Y:Number(incomingData[i][2])});
    }
  };
  var box = [];
  userData = userData.slice(7,-3);
  box.push(userData[0]);
  box.push(userData[1]);
  box.push(userData[2]);
  box.push(userData[3]);
  box.push(userData[4]);
  console.log(box);
  console.log(userData);
  x.domain(d3.extent(userData, function(d) { return d.X; }));
  y.domain(d3.extent(userData, function(d) { return d.Y; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em");

  svg.append("path")
      .datum(userData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  svg.append("path")
      .datum(box)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", line);
});
