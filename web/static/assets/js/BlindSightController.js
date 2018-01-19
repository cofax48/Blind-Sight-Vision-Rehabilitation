//This is the root url, to be switched in production
//var aPIROOT = 'http://localhost:5000/';
var aPIROOT = "Just For ME"
var testDate = '';
//Accsses the root of the angular app
angular.module('BlindSightVision')
.controller("VisionController", ['$scope', '$http', function ($scope, $http) {
  var institution = 'DrJ';
  $scope.PatientNameAndTrialData = [];
  $scope.TrialAndColor = [];
  $scope.currentlySelectedTrials = [];

  //Possible colors for the line
  var colorList = ['#B0171F', '#DC143C', '#FFB6C1', '#FFAEB9', '#EEA2AD',
  '#CD8C95', '#8B5F65', '#FFC0CB', '#FFB5C5', '#EEA9B8', '#CD919E', '#8B636C',
  '#DB7093', '#FF82AB', '#EE799F', '#CD6889', '#8B475D', '#FFF0F5', '#EEE0E5',
  '#C5C1AA', '#C67171', '#555555'];

  var colorSelector = function() {
    var colorToUse = colorList[Math.floor(Math.random() * colorList.length)]
    return colorToUse;
  }

  function PatientNameAcquisition() {
    $http.get(aPIROOT + 'usersList/' + institution)
    .then(function(response) {
      response.data.forEach(function(patient){
        $scope.PatientNameAndTrialData.push(patient);
      });
    })
    .catch(function (response) {
        console.error('API error', response.status, response.data);
    })
    .finally(function () {
      console.log('data uploaded');
    });
  };
  PatientNameAcquisition();

  $scope.quadrantOptions = ["Top Right-1", "Top Left-2", "Bottom Left-3", "Bottom Right-4"];
  //http://localhost:5000/trialApi/Josh_Schenkein/09-12-2017

  var currentPatient = [];
  var boxQuadrants = [];

  //Fires when a Patient's name is chosen
  $scope.PatientDateSelection = function(PatientName) {
    console.log($scope.PatientNameAndTrialData);
    $scope.PatientNameAndTrialData.forEach(function(patients) {
      if (patients["Patient Name"] == PatientName) {
        console.log(PatientName, patients["Trial Dates"]);
        currentPatient.push(PatientName);
        $scope.PatientTrialDates = patients["Trial Dates"];
      };
    });
  };

  $scope.PatientDataAcquisition = function(TrialDate) {
    d3.select("div#containerForMultGraphs").selectAll("*").remove();
    testDate = TrialDate;
    $scope.patient = currentPatient[0];
    $scope.date = TrialDate;
    $http.get(aPIROOT + "trialApi/" + currentPatient[0] + '/' + TrialDate).
      then(function (incomingData) {
        console.log(incomingData);
        var TrialLength = Number(incomingData.data[0][0]) + 2;
        //Used to populate number of svg thumbnails to draw
        $scope.TotalTrialNumbers = Array.apply(null, {length: TrialLength})
                                    .map(Number.call, Number).slice(1,);
        PatientInfo = currentPatient[0] + ' ' + testDate[-1];
        //If PatientInfo is object then fires the function to build all needed
        //svg tags to later attach multiple directives to
        if (PatientInfo) {allTrialsAtOnce(
                          PatientInfo, Array.apply(null, {length: TrialLength})
                          .map(Number.call, Number).slice(1,));};
                        })
        .catch(function (response) {
            console.error('API error', response.status, response.data);
        })
        .finally(function () {
          PatientInfo = PatientName + ' ' + TrialDate;
          currentPatient.push(PatientInfo);
        });

  };

  function GraphMultipleTrialsByQuadrant(trialsByQuadrant) {
    var wholeData = ["Q"];
    var counter = 0;
    var masterLength = 0;
    var numTialsInQuadrant = trialsByQuadrant.length;

    trialsByQuadrant.forEach(function(TrialChosen) {

      var currentTrial = TrialChosen;
      var userData = [];

      $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + TrialChosen).
      then(function (incomingData) {
        if (counter > 0) {
          userData = [];
          userData.push({'X':0, 'Y':0});
        };
        incomingData.data.forEach(function(i) {
          if (counter == 0) {
            masterLength = i;
            counter++;
          }
          else {
            if (i[1] == null) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else if (i[2] == null) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else if (i[1] == NaN) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else if (i[2] == NaN) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else {
              userData.push({X:Number(i[1]), Y:Number(i[2])});
              counter++;
            };
          };
        });
      })
      .catch(function (response) {
          console.error('API error', response.status, response.data);
      })
      .finally(function () {
        $scope.TrialAndColor.forEach(function(trial) {
          if (Number(trial.trial -1) == TrialChosen) {
            wholeData.push([trial.color, TrialChosen].concat(userData));
          };
        });
        //wholeData.push([$scope.currentColor, TrialChosen].concat(userData));
        //If Trial Number is changed then the line graph redraws
      });
    });
    //console.log(wholeData);
    $scope.userData = wholeData;
  };

  $scope.QuadrantGraphSelection = function(QuadrantSelect) {
    var QuadrantSelect = QuadrantSelect.slice(-1);
    var trialsByQuadrant = BoxDetermination(QuadrantSelect, boxQuadrants);
    //console.log(trialsByQuadrant);
    GraphMultipleTrialsByQuadrant(trialsByQuadrant);
  };


  //The function to fire the building of thumbnails for all trials
  function allTrialsAtOnce(PatientInfo, TrialLength) {
    TrialLength.forEach(function(trial){
      var userData = [];
      var counter = 0;
      var masterLength = 0;

      $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + trial).
      then(function (incomingData) {
        if (counter > 0) {
          userData = [];
          userData.push({'X':0, 'Y':0});
        };
        incomingData.data.forEach(function(i) {
          if (counter == 0) {
            masterLength = i;
            counter++;
          }
          else {
            if (i[1] == null) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else if (i[2] == null) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else if (i[1] == NaN) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else if (i[2] == NaN) {
              userData.push({X:0, Y:0});
              counter++;
            }
            else {
              userData.push({X:Number(i[1]), Y:Number(i[2])});
              counter++;
            };
          };
        });
        if (userData[8] != null) {
          //console.log(trial);
          //console.log(userData[8]);
          boxQuadrants.push({counter: userData[8], trial: trial});
        };
      })
      .catch(function (response) {
          console.error('API error', response.status, response.data);
      })
      .finally(function () {
        //If Trial Number is changed then the line graph redraws
        //console.log(userData);
        if (userData.length >= masterLength) {
            if (userData.length >= masterLength) {
              var trial0 = Number(trial) + 1;
              var colorSelected = colorSelector();

              $scope.allPatientTrialData = [trial0, colorSelected].concat(userData);
              $scope.TrialAndColor.push({"trial":trial0, "color":colorSelected})

              // Adds the SVG holder for multiple thumbnails to the page
              var MultiGraphDiv = d3.select("div#containerForMultGraphs");

              MultiGraphDiv.append("svg")
                          .attr("id", "MultiGraph".concat(String(trial)));
              MultiGraphDiv.append("input")
                           .attr("type", "checkbox")
                           .attr("id", "checkbox".concat(String(trial)))
                           .style("position", "inherit");


              //On click of svg canvas function fires the launch of thumbnail
              //svg number into main graph draw-spcifically the specific tial function
              var svg = d3.select("svg#MultiGraph".concat(String(trial)))
              .on("click", function (d) {$scope.SpecificTrial(String(svg._groups["0"]["0"].id).slice(10,));})
              //Adds the chcekbox to the multigraph
              var checkbox = d3.select("input#checkbox".concat(String(trial)))
              .on("click", function (d) {$scope.checkboxTrial(String(svg._groups["0"]["0"].id).slice(10,));})
            }
        };
      });

  });//For Loop
  };

  //If the checkbox in the MultiGraph thumbnail is clicked, this function fires
  $scope.checkboxTrial = function(trialSelect) {
    //If the selectd trail is not in the scope, it's added
    if ($scope.currentlySelectedTrials.indexOf(String(trialSelect)) == -1) {
      $scope.currentlySelectedTrials.push(trialSelect);
      //The graph is drawn with the new trial
      GraphMultipleTrialsByQuadrant($scope.currentlySelectedTrials);
      $scope.display = "Patient " + $scope.patient + " Trial Date " + $scope.date + " Trials " + $scope.currentlySelectedTrials;

    }
    else {
      //If the selected trial is being removed
      var oldList = $scope.currentlySelectedTrials;
      //Makes a copy of th list
      $scope.currentlySelectedTrials = [];
      oldList.forEach(function(trialUNSelect) {
        if (trialUNSelect != trialSelect) {
          //if its not the selected trial it pushs back to the scope
          $scope.currentlySelectedTrials.push(trialUNSelect);
        }
        else {
          //Counts how many "paths" on the svg have been cycled through
          counter = 0;
          //cycles through each path on the svg
          d3.select("svg#SingleLineGaphSvg")._groups["0"]["0"].childNodes.forEach(function(pathElement) {
            if (pathElement.id == trialSelect) {
              //if the clicked item matches th selectd path then it removes the line
              d3.select("svg#SingleLineGaphSvg")._groups["0"]["0"].childNodes[counter].remove();
              //Also removes the box
              if (d3.select("svg#SingleLineGaphSvg")._groups["0"]["0"].childNodes[counter]) {
                d3.select("svg#SingleLineGaphSvg")._groups["0"]["0"].childNodes[counter].remove();
              };
            };
            counter++;
          });
        };//if
      });//Oldlist loop
      //Pushes the current list of selected trials back to th directive to draw
      GraphMultipleTrialsByQuadrant($scope.currentlySelectedTrials);
      $scope.display = "Patient " + $scope.patient + " Trial Date " + $scope.date + " Trials " + $scope.currentlySelectedTrials;
    };

  };

  function BoxDetermination(QuadrantSelect, boxQuadrants) {
    //console.log(QuadrantSelect);
    //console.log(boxQuadrants);
    var trialQuadrantInfo = [];
    boxQuadrants.forEach(function(trial) {
        //console.log(trial);
      if (trial.counter.X > 900) {
        if (trial.counter.Y > 550) {
          if (QuadrantSelect == 1) {
            trialQuadrantInfo.push(trial.trial);
          }
        }
        if (trial.counter.Y < 550) {
          if (QuadrantSelect == 4) {
            trialQuadrantInfo.push(trial.trial);
          }
        }
      }
      if (trial.counter.X  < 900) {
        if (trial.counter.Y > 550) {
          if (QuadrantSelect == 2) {
            trialQuadrantInfo.push(trial.trial);
          }
        }
        if (trial.counter.Y < 550) {
          if (QuadrantSelect == 3) {
            trialQuadrantInfo.push(trial.trial);
          }
        }
      }
    });
    return trialQuadrantInfo;
  };


  //Fires when the trial is chosen
  $scope.SpecificTrial = function(TrialChosen) {
    patAndDate = String(currentPatient[0]);
    var patientAndDate = patAndDate.split(" ");
    $scope.display = "Patient: " + String(patientAndDate[0]).replace('_', ' ') + ", Date: " + testDate + " Trial " + TrialChosen;
    var currentTrial = TrialChosen;

    var userData = [];
    var counter = 0;
    var masterLength = 0;

    $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + TrialChosen).
    then(function (incomingData) {
      if (counter > 0) {
        userData = [];
        userData.push({'X':0, 'Y':0});
      };
      incomingData.data.forEach(function(i) {
        if (counter == 0) {
          masterLength = i;
          counter++;
        }
        else {
          if (i[1] == null) {
            userData.push({X:0, Y:0});
            counter++;
          }
          else if (i[2] == null) {
            userData.push({X:0, Y:0});
            counter++;
          }
          else if (i[1] == NaN) {
            userData.push({X:0, Y:0});
            counter++;
          }
          else if (i[2] == NaN) {
            userData.push({X:0, Y:0});
            counter++;
          }
          else {
            userData.push({X:Number(i[1]), Y:Number(i[2])});
            counter++;
          };
        };
      });
    })
    .catch(function (response) {
        console.error('API error', response.status, response.data);
    })
    .finally(function () {
    //If the trial changes and new data arrives then the data is sent to the directive
    if (userData.length >= masterLength) {
      $scope.$watch('currentTrial', function() {
        if (userData.length >= masterLength) {
          $scope.TrialAndColor.forEach(function(trial) {
            if (Number(trial.trial -1) == TrialChosen) {
              $scope.userData = [trial.color].concat(userData);
            };
          });
        }
      });
    };
  });//finally
};//Specific Trial


  function init() {
  console.log('yao');
};
init();
}]);
