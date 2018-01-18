MomVision.directive('patientLinechart', function(){
  function link(scope, element, attr){
    scope.$watch('data', function(data){
      d3.select("svg#GraphCountryD3").selectAll("*").remove();
        if (data != null) {
          console.log(data);
          var userData = data;
          var box = [];
          userData = userData.slice(6,-3);
          box.push(userData[0]);
          box.push(userData[1]);
          box.push(userData[2]);
          box.push(userData[3]);
          box.push(userData[4]);
          console.log(box);
          // Set the dimensions of the canvas / graph
          var margin = {top: 30, right: 20, bottom: 30, left: 50},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          // Adds the SVG to the page
          var svg = d3.select("svg#GraphCountryD3")
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

              /*
            x.domain(d3.extent(userData, function(d) { return d.X; }));
            y.domain(d3.extent(userData, function(d) { return d.Y; }));
            */
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
