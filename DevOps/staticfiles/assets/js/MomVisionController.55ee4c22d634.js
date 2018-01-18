//This is the root url, to be switched in production
var aPIROOT = 'http://localhost:5000/';
var testDate = '09-12-2017';
//Accsses the root of the angular app
angular.module('MomVision')
.controller("VisionController", ['$scope', '$http', function ($scope, $http) {

  $scope.PatientNameData = ["Josh_Schenkein", "Hank Rearden"];
  //http://localhost:5000/trialApi/Josh_Schenkein/09-12-2017

  var currentPatient = [];

  //Fires when a Patient's name is chosen
  $scope.PatientDataAcquistion = function(PatientName) {
    $http.get(aPIROOT + "trialApi/" + PatientName + '/' + testDate).
      success(function(incomingData, status, headers, config) {
        var TrialLength = Number(incomingData[0][0]) + 2;
        $scope.TotalTrialNumbers = Array.apply(null, {length: TrialLength}).map(Number.call, Number).slice(1,);
        PatientInfo = PatientName + ' ' + testDate;
        if (PatientInfo) {allTrialsAtOnce(PatientInfo, Array.apply(null, {length: TrialLength}).map(Number.call, Number).slice(1,));};
      });
      PatientInfo = PatientName + ' ' + testDate;
      currentPatient.push(PatientInfo);
  };

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
              userData.push({X:Number(incomingData[i][1]), Y:Number(incomingData[i][2])});
            }
          }
        };
        counter++;
        //If Trial Number is changed then the line graph redraws
        //console.log(userData);
        if (userData.length >= masterLength) {
            if (userData.length >= masterLength) {
              $scope.allPatientTrialData = [counter].concat(userData);
              //console.log(counter, userData);

              // Adds the SVG to the page
              var MultiGraphDiv = d3.select("div#containerForMultGraphs");
              MultiGraphDiv.append("svg")
                          .attr("id", "MultiGraph".concat(String(counter)));
              //console.log(MultiGraphDiv);

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

  //Fires when the trial is chosen
  $scope.SpecificTrial = function(TrialChosen) {
    patAndDate = String(currentPatient[0]);
    console.log(patAndDate);
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

    if (userData.length >= masterLength) {
      $scope.$watch('currentTrial', function() {
        console.log(currentTrial);
        console.log(userData.length, masterLength);
        if (userData.length >= masterLength) {
          $scope.userData = userData;
        }
      });
    };

    console.log(counter);
  };
  function init() {
  console.log('yao');
};
init();
}]);
