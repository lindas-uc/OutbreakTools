app.controller('lindasMainCtrl', function($scope, sparql, validator) {
    //tie => tested infected entities
    $scope.tieIds = new Array(1);
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.value = "initialize";
    $scope.invalidIds = false;
    $scope.difference = 0;
    $scope.dateInvalid = false;

    $scope.addEmptyTieIds = function() {
        $scope.tieIds.push(null);
    };

    $scope.setStartDate = function(startDate) {
        $scope.startDate = startDate;
    };

    $scope.setEndDate = function(endDate) {
        $scope.endDate = endDate;
    };

    $scope.$watch('startDate', function() {
        if ((validator.validateDate($scope.startDate)) || (validator.validateDate($scope.endDate)))
            $scope.dateInvalid = true;
        else
            $scope.dateInvalid = false;
    });

    $scope.$watch('endDate', function() {
        if ((validator.validateDate($scope.startDate)) || (validator.validateDate($scope.endDate)))
            $scope.dateInvalid = true;
        else
            $scope.dateInvalid = false;
    });

    $scope.$watch('difference', function() {
        if ($scope.difference == 0)
            return null;
        var d = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        d.setDate(d.getDate()-$scope.difference);
        $scope.startDate = moment(d).format('DD/MM/YYYY');
    });

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

        if (!validator.validateDate(startDate) || !validator.validateDate(endDate)) {
            $scope.dateInvalid = true;
            return null;
        } else
            $scope.dateInvalid = false;

        //execute sparql query
        var result = sparql.executeSparql();
        console.log(result);


    }
});