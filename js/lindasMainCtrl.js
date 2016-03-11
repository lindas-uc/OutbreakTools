app.controller('lindasMainCtrl', function($scope) {
    //tie => tested infected entities
    $scope.tieIds = new Array(1);
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.value = "initialize";
    $scope.invalidIds = false;
    $scope.invalidStartOrEndDate = false;

    $scope.addEmptyTieIds = function() {
        $scope.tieIds.push(null);
    }

    $scope.setStartDate = function(startDate) {
        $scope.startDate = startDate;
    }

    $scope.setEndDate = function(endDate) {
        $scope.endDate = endDate;
    }

    $scope.initializeVisualisation = function() {
        console.log("start Visualization");

        //Validation of Inputfields
        var validId = false;
        $scope.tieIds.forEach(function(n) {
            if (n > 0) {
                validId = true;
            }
        });
        if (!validId) {
            $scope.invalidIds = true;
        } else
            $scope.invalidIds = false;

        if ($scope.startDate == "" || $scope.endDate == "") {
            $scope.invalidStartOrEndDate = true;
        } else
            $scope.invalidStartOrEndDate = false;

        if ($scope.invalidIds || $scope.invalidStartOrEndDate)
            return null;

        console.log($scope.startDate);
        console.log($scope.tieIds)

    }
});