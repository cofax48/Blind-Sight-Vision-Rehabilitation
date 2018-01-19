BlindSightVision.directive('allPatientTrials', function(){
  function link(scope, element, attr){
    scope.$watch('data', function(data){
        if (data != null) {
          //console.log(data);
          var counter = data[0] - 1;
          scope.colorToUse = data[1];
          //console.log(scope.colorToUse);
          data = data.slice(2,-1);

          var userData = data.slice(1,-1);

          //Sends the coodinates for the box to box array
          var box = [];
          //console.log(userData);
          userData = userData.slice(5,-3);
          box.push(userData[0]);
          box.push(userData[1]);
          box.push(userData[2]);
          box.push(userData[3]);
          box.push(userData[4]);
          // Set the dimensions of the canvas / graph
          var margin = {top: 30, right: 20, bottom: 30, left: 50},
              width = 250 - margin.left - margin.right,
              height = 175 - margin.top - margin.bottom;

          // Adds the SVG to the page
          var svg = d3.select("svg#MultiGraph".concat(String(counter)))
              .attr("width", width)
              .attr("height", height + margin.top + margin.bottom);

          var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("text")
              .style("text-align", "right")
              .text("Trial Number ".concat(String(counter)));

          var x = d3.scaleLinear()
              .domain([0, 1500])
              .rangeRound([50, width - 30]);

          var y = d3.scaleLinear()
              .domain([0, 1500])
              .rangeRound([height, 0]);

          var line = d3.line()
              .x(function(d) { return x(d.X); })
              .y(function(d) { return y(d.Y); });

            g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(-50," + height + ")")
            .call(d3.axisBottom(x).ticks(4));

            //The x axis quadrant bar
            g.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(-50," + y.range()[0] / 2 + ")")
              .call(d3.axisBottom(x).ticks(0));

            //The y axis quadrant bar
            g.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(55, 0)")
                .call(d3.axisLeft(y).ticks(0));

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
                .attr("stroke", scope.colorToUse)
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
                .attr("stroke-width", 5.5)
                .attr("d", line);

          }; //If data is populated
        }, true); // Watcher
      }//Link function
      return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
      }
});
