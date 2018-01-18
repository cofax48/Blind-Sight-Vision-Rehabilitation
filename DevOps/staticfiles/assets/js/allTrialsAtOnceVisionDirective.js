MomVision.directive('allPatientTrials', function(){
  function link(scope, element, attr){
    scope.$watch('data', function(data){
        if (data != null) {
          console.log(data);
          var counter = data[0] - 1;
          data = data.slice(1,-1);
          var userData = data.slice(1,-1);

          //Sends the coodinates for the box to box array
          var box = [];
          userData = userData.slice(6,-3);
          box.push(userData[0]);
          box.push(userData[1]);
          box.push(userData[2]);
          box.push(userData[3]);
          box.push(userData[4]);
          //console.log(userData);
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

          //Possible colors for the line
          var colorList = ["#C0C0C0", "#808080", "#000000", "#FF0000", "#0006ca",
          "#0060ca", "#00a6ca", "#00ccbc", "#23d7b1", "#48eb9d", "#90eb9d", "#c7eb9d",
          "#ffeb8c", "#f9dc8c", "#f9d057", "#f9ad57", "#f29e2e", "#e79018", "#e76818",
          "#d7411c", "#d7191c", "#800000", "#FFFF00", "#808000", "#00FF00", "#008000",
          "#00FFFF", "#008080", "#0000FF", "#000080"];

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
                .attr("stroke", function(counter) {
                  var colorToUse = colorList[Math.floor(Math.random() * colorList.length)]
                  return colorToUse;
                })
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
