//Global variable to keep track of axis draws
var counter = 0;

BlindSightVision.directive('patientLinechart', function(){
  function link(scope, element, attr){
    scope.$watch('data', function(data){
      //if theres data
      if (data) {
        //console.log(data);
        //'Q' represents multiple data from the quandrant controller
        //if the Q leads off the array then the data needs to be handled differently
        //essentially the svg needs to redraw if there is no q, but only partially if there is a q
        if (data["0"] != 'Q') {
          scope.colorToUse = data[0];
          data = data.slice(1,);
          d3.select("svg#SingleLineGaphSvg").selectAll("*").remove();
          counter = 0;
          var userData = data;
          if (userData){
          graphDraw(userData);
          }
        }
        else {
            if (data != null) {
              //gets rid of the q
              //console.log(data);
              data = data.slice(1,);
              //does a loop for each trial in th selected quadrant
              data.forEach(function(maData) {
                var userData = maData;
                scope.colorToUse = userData[0];
                scope.currentTrial = userData[1];
                console.log(scope.currentTrial);
                allData = userData.slice(4,);
                graphDraw(allData);
              });
              }; //If data is populated
            };//Else aka not a multigraph draw
          };//If data
      }, true); // Watcher

    function graphDraw(userData) {
      if (userData) {
        //For some reason the arays were dirreffent lengths, this makes sure everything lines up
        if (userData[2].Y == 0) {
          var box = [];
          //console.log(userData);
          userData = userData.slice(4,-3);
          box.push(userData[0]);
          box.push(userData[1]);
          box.push(userData[2]);
          box.push(userData[3]);
          box.push(userData[4]);
          actuallyDrawTheGraph(userData, box)
        }
        else {
          var box = [];
          userData = userData.slice(6,-3);
          box.push(userData[0]);
          box.push(userData[1]);
          box.push(userData[2]);
          box.push(userData[3]);
          box.push(userData[4]);
          actuallyDrawTheGraph(userData, box);
        }

      function actuallyDrawTheGraph(userData, box) {
        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = 950 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // Adds the SVG to the page
        var svg = d3.select("svg#SingleLineGaphSvg")
          .attr("width", width)
          .attr("height", height + margin.top + margin.bottom);

        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
        .domain([0, 1700])
        .rangeRound([50, width]);

        var y = d3.scaleLinear()
        .domain([0, 1100])
        .rangeRound([height, 0]);

        var line = d3.line()
            .x(function(d) { return x(d.X); })
            .y(function(d) { return y(d.Y); });

        // Define the div for the tooltip
        var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        //If the graph is drawn for the first time, when drwing multiple lines, it draws the axeses
        //othewise it does not redraw the axes
        if (counter == 0) {

          g.append("g")
              .attr("transform", "translate(-50," + height + ")")
              .call(d3.axisBottom(x))
            .select(".domain")
              .remove();

          //The x axis quadrant bar
          g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(-50," + y.range()[0] / 2 + ")")
            .call(d3.axisBottom(x).ticks(0));

        //The y axis quadrant bar
        g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
            .call(d3.axisLeft(y).ticks(0));

        //left axis
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
              .attr("id", scope.currentTrial)
              .attr("stroke", scope.colorToUse)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 1.5)
              .attr("d", line);

          svg.append("path")
              .datum(box)
              .attr("fill", "none")
              .attr("id", "box".concat(scope.currentTrial))
              .attr("stroke", "black")
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 5.5)
              .attr("d", line);

          //lets the global counter know that the axes have been drawn
          counter++;
            }
        else {
          //If the axes hav alrady been drawn then the new lines are added
          svg.append("path")
              .datum(userData)
              .attr("fill", "none")
              .attr("id", scope.currentTrial)
              .attr("stroke", scope.colorToUse)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 1.5)
              .attr("d", line);

          svg.append("path")
              .datum(box)
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr("id", "box".concat(scope.currentTrial))
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 5.5)
              .attr("d", line);

            svg.selectAll("path")
            .on("mouseover", function (p) {
                div.html("Trial " + scope.currentTrial)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY) + "px")
                  .style("size", "3em")
                  .style("stroke-opacity", 1.0)
                  .style("color", "black");
                console.log('yayo');
                div.style("visibility", "visible");
            })
            .on("mouseout", function (d) {
                div.style("visibility", "hidden");
            });

            }//The draw the lines if the axes are already drawnn
            } //Actually Draw the Graph
        }//if userData
      } //Graph Draw

      }//Link function
      return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
      }
});
