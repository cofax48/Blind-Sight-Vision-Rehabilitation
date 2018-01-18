//Global variable to keep track of axis draws
var counter = 0;

MomVision.directive('patientLinechart', function(){
  function link(scope, element, attr){
    scope.$watch('data', function(data){
      //if theres data
      if (data) {
        //'Q' represents multiple data from the quandrant controller
        //if the Q leads off the array then the data needs to be handled differently
        //essentially the svg needs to redraw if there is no q, but only partially if there is a q
        if (data["0"] != 'Q') {
          d3.select("svg#SingleLineGaphSvg").selectAll("*").remove();
          counter = 0;
          var userData = data;
          graphDraw(userData);
          }
        else {
            if (data != null) {
              //gets rid of the q
              data = data.slice(1,);
              //does a loop for each trial in th selected quadrant
              for (individualTrial in data) {
                var userData = data[individualTrial];
                graphDraw(userData);

              }; //If data is populated
            };
          }
        } // Else aka not a multigraph draw
      }, true); // Watcher

    function graphDraw(userData) {
        //For some reason the arays were dirreffent lengths, this makes sure everything lines up
        if (userData[2].Y == 0) {
          var box = [];
          userData = userData.slice(7,-3);
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
            width = 960 - margin.left - margin.right,
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

        //Possible colors for the line
        var colorList = ["#C0C0C0", "#808080", "#000000", "#FF0000", "#0006ca",
        "#0060ca", "#00a6ca", "#00ccbc", "#23d7b1", "#48eb9d", "#90eb9d", "#c7eb9d",
        "#ffeb8c", "#f9dc8c", "#f9d057", "#f9ad57", "#f29e2e", "#e79018", "#e76818",
        "#d7411c", "#d7191c", "#800000", "#FFFF00", "#808000", "#00FF00", "#008000",
        "#00FFFF", "#008080", "#0000FF", "#000080"];

        var line = d3.line()
            .x(function(d) { return x(d.X); })
            .y(function(d) { return y(d.Y); });

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

          //lets the global counter know that the axes have been drawn
          counter++;
            }
        else {
          //If the axes hav alrady been drawn then the new lines are added
          svg.append("path")
              .datum(userData)
              .attr("fill", "none")
              .attr("stroke", function(counter) {
                //randomizes the color of the line
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


            }//The draw the lines if the axes are already drawnn
            } //Actually Draw the Graph
      } //Graph Draw

      }//Link function
      return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
      }
});
