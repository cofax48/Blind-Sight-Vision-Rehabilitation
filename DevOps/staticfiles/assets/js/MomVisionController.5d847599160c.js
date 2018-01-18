//This is the root url, to be switched in production
var aPIROOT = 'http://localhost:5000/';
//var aPIROOT = 'https://momvisionproject.herokuapp.com/';
var testDate = '09-12-2017';
//Accsses the root of the angular app
angular.module('MomVision')
.controller("VisionController", ['$scope', '$http', function ($scope, $http) {

  $scope.PatientNameData = ["Josh_Schenkein", "Hank Rearden"];

  $scope.quadrantOptions = ["Top Right-1", "Top Left-2", "Bottom Left-3", "Bottom Right-4"];
  //http://localhost:5000/trialApi/Josh_Schenkein/09-12-2017

  var currentPatient = [];
  var boxQuadrants = [];

  //Fires when a Patient's name is chosen
  $scope.PatientDataAcquistion = function(PatientName) {
    $http.get(aPIROOT + "trialApi/" + PatientName + '/' + testDate).
      success(function(incomingData, status, headers, config) {
        var TrialLength = Number(incomingData[0][0]) + 2;
        //Used to populate number of svg thumbnails to draw
        $scope.TotalTrialNumbers = Array.apply(null, {length: TrialLength})
                                    .map(Number.call, Number).slice(1,);
        PatientInfo = PatientName + ' ' + testDate;
        //If PatientInfo is object then fires the function to build all needed
        //svg tags to later attach multiple directives to
        if (PatientInfo) {allTrialsAtOnce(
                          PatientInfo, Array.apply(null, {length: TrialLength})
                          .map(Number.call, Number).slice(1,));};
                          });
      PatientInfo = PatientName + ' ' + testDate;
      currentPatient.push(PatientInfo);

  };

  $scope.QuadrantGraphSelection = function(QuadrantSelect) {
    var QuadrantSelect = QuadrantSelect.slice(-1);
    var trialsByQuadrant = BoxDetermination(QuadrantSelect, boxQuadrants);
    console.log(trialsByQuadrant);
    GraphMultipleTrialsByQuadrant(trialsByQuadrant);
    function GraphMultipleTrialsByQuadrant(trialsByQuadrant) {
      var wholeData = ["Q"];
      var counter = 0;
      var masterLength = 0;
      var numTialsInQuadrant = trialsByQuadrant.length;

      for (trials in trialsByQuadrant) {
        console.log(trialsByQuadrant[trials])
        var TrialChosen = trialsByQuadrant[trials];
        var currentTrial = TrialChosen;
        var userData = [];

        $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + TrialChosen).
        success(function(incomingData, status, headers, config) {
          if (counter > 0) {
            userData = [];
            userData.push({'X':0, 'Y':0});
          };
          for (var i in incomingData) {
            if (i == 0) {
              masterLength = incomingData[i];
            }
            else {
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
            }
          };
          counter++;
          wholeData.push(userData);
          //If Trial Number is changed then the line graph redraws
        }).
        error(function(data, status, headers, config) {
          console.log(data);// log error
        });

        //If the trial changes and new data arrives then the data is sent to the directive
        /*
        if (userData.length >= masterLength) {
          $scope.$watch('currentTrial', function() {
            if (userData.length >= masterLength) {
              console.log(q)
              $scope.userData = userData;
            }
          });
        };
        */
      }
      console.log(counter);
      console.log(wholeData);
    $scope.userData = wholeData;
      /*
      patAndDate = String(currentPatient[0]);
      var patientAndDate = patAndDate.split(" ");
      $scope.display = "Patient: " + String(patientAndDate[0]).replace('_', ' ') + ", Date: " + patientAndDate[1] + " Trial " + TrialChosen;
      var currentTrial = TrialChosen;

      var userData = [];
      var counter = 0;
      var masterLength = 0;

      $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + TrialChosen).
      success(function(incomingData, status, headers, config) {
        if (counter > 0) {
          userData = [];
          userData.push({'X':0, 'Y':0});
        };
        for (var i in incomingData) {
          if (i == 0) {
            masterLength = incomingData[i];
          }
          else {
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
          }
        };
        counter++;
        //If Trial Number is changed then the line graph redraws
      }).
      error(function(data, status, headers, config) {
        console.log(data);// log error
      });

      //If the trial changes and new data arrives then the data is sent to the directive
      if (userData.length >= masterLength) {
        $scope.$watch('currentTrial', function() {
          if (userData.length >= masterLength) {
            $scope.userData = userData;
          }
        });
      };
      */
    };
  };


  //The function to fire the building of thumbnails for all trials
  function allTrialsAtOnce(PatientInfo, TrialLength) {
    for (trial = 0; trial < TrialLength.length; trial++) {

      var userData = [];
      var counter = 0;
      var masterLength = 0;

      $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + trial).
      success(function(incomingData, status, headers, config) {
        if (counter > 0) {
          userData = [];
          userData.push({'X':0, 'Y':0});
        };
        for (var i in incomingData) {
          if (i == 0) {
            masterLength = incomingData[i];
          }
          else {
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
              //console.log({X:Number(incomingData[i][1]), Y:Number(incomingData[i][2])});
              userData.push({X:Number(incomingData[i][1]), Y:Number(incomingData[i][2])});
            }
          }
        };
        if (userData[8] != null) {
          console.log(userData[8]);
          boxQuadrants.push({counter: userData[8]});
      };
        counter++;
        //If Trial Number is changed then the line graph redraws
        //console.log(userData);
        if (userData.length >= masterLength) {
            if (userData.length >= masterLength) {
              $scope.allPatientTrialData = [counter].concat(userData);

              // Adds the SVG holder for multiple thumbnails to the page
              var MultiGraphDiv = d3.select("div#containerForMultGraphs");
              MultiGraphDiv.append("svg")
                          .attr("id", "MultiGraph".concat(String(counter)));

              //On click of svg canvas function fires the launch of thumbnail
              //svg number into main graph draw-spcifically the specific tial function
              var svg = d3.select("svg#MultiGraph".concat(String(counter)))
              .on("click", function (d) {$scope.SpecificTrial(String(svg._groups["0"]["0"].id).slice(10,));})
            }
        };
      }).
      error(function(data, status, headers, config) {
        console.log(data);// log error
      });

  };//For Loop
  };

  function BoxDetermination(QuadrantSelect, boxQuadrants) {
    var trialQuadrantInfo = [];
    for (i in boxQuadrants) {
      if (boxQuadrants[i].counter.X > 900) {
        if (boxQuadrants[i].counter.Y > 550) {
          if (QuadrantSelect == 1) {
            trialQuadrantInfo.push(Number(i) + 1);
          }
        }
        if (boxQuadrants[i].counter.Y < 550) {
          if (QuadrantSelect == 4) {
            trialQuadrantInfo.push(Number(i) + 1);
          }
        }
      }
      if (boxQuadrants[i].counter.X  < 900) {
        if (boxQuadrants[i].counter.Y > 550) {
          if (QuadrantSelect == 2) {
            trialQuadrantInfo.push(Number(i) + 1);
          }
        }
        if (boxQuadrants[i].counter.Y < 550) {
          if (QuadrantSelect == 3) {
            trialQuadrantInfo.push(Number(i) + 1);
          }
        }
      }
    }
    return trialQuadrantInfo;
  };


  //Fires when the trial is chosen
  $scope.SpecificTrial = function(TrialChosen) {
    patAndDate = String(currentPatient[0]);
    var patientAndDate = patAndDate.split(" ");
    $scope.display = "Patient: " + String(patientAndDate[0]).replace('_', ' ') + ", Date: " + patientAndDate[1] + " Trial " + TrialChosen;
    var currentTrial = TrialChosen;

    var userData = [];
    var counter = 0;
    var masterLength = 0;

    $http.get(aPIROOT + "tableApi/" + $scope.PatientName + '/' + testDate + '/' + TrialChosen).
    success(function(incomingData, status, headers, config) {
      if (counter > 0) {
        userData = [];
        userData.push({'X':0, 'Y':0});
      };
      for (var i in incomingData) {
        if (i == 0) {
          masterLength = incomingData[i];
        }
        else {
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
        }
      };
      counter++;
      //If Trial Number is changed then the line graph redraws
    }).
    error(function(data, status, headers, config) {
      console.log(data);// log error
    });

    //If the trial changes and new data arrives then the data is sent to the directive
    if (userData.length >= masterLength) {
      $scope.$watch('currentTrial', function() {
        if (userData.length >= masterLength) {
          $scope.userData = userData;
        }
      });
    };

  };
  function init() {
  console.log('yao');
};
init();
}]);
