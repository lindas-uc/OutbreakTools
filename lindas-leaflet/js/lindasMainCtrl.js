app.controller('lindasMainCtrl', function($scope, sparql, validator, map, $timeout) {
    //tie => tested infected entities
    $scope.tieIds = new Array({id:null,valid:true});
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.startDateMilliseconds = 0;
    $scope.endDateMilliseconds = 0;
    $scope.value = "initialize";
    $scope.difference = 0;
    $scope.dateInvalid = false;
    //set this to false at end
    $scope.mapVisible = false;
    $scope.filterStartDateMilliseconds = 0;
    $scope.filterEndDateMilliseconds = 0;
    $scope.leafletMap = {};
    $scope.originalData = [];
    $scope.animationRunning = false;

    $scope.addEmptyTieIds = function() {
        $scope.tieIds.push({id:null,valid:true});
    };

    $scope.removeTieIds = function(index) {
        if (index < 0)
            console.debug("Index too small: "+ index);
        $scope.tieIds.splice(index,1);
    };

    $scope.setStartDate = function(startDate) {
        $scope.startDate = startDate;
    };

    $scope.setEndDate = function(endDate) {
        $scope.endDate = endDate;
    };

    $scope.$watch('difference', function() {
        if ($scope.difference == 0)
            return null;
        var d = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        d.setDate(d.getDate()-$scope.difference);
        $scope.startDate = moment(d).format('DD/MM/YYYY');
    });

    //convert startDate to Milliseconds since 01.01.1970
    $scope.$watch('startDate',function() {
        $scope.startDateMilliseconds = moment($scope.startDate,"DD/MM/YYYY").toDate().getTime();
    })

    //convert endDate to Milliseconds since 01.01.1970
    $scope.$watch('startDate',function() {
        $scope.endDateMilliseconds = moment($scope.endDate,"DD/MM/YYYY").toDate().getTime();
    })

    $scope.initializeVisualisation = function() {
        console.log("start Visualization");

        //validate date
        if ((validator.validateDate($scope.startDate)) || (validator.validateDate($scope.endDate))) {
            $scope.dateInvalid = false;
        } else {
            $scope.dateInvalid = true;
            console.log("Date invalid");
            return null;
        }

        //validate Ids
        for (var i = 0; i < $scope.tieIds.length; i++) {
            if (validator.validateTieIds($scope.tieIds[i].id)) {
                $scope.tieIds[i].valid = true;
            } else {
                console.debug("invalid Id");
                $scope.tieIds[i].valid = false;
                var invalid = true;
            }
        }
        if (invalid) {
            console.debug("Id invalid");
            return null;
        }


        /*
        sparql.addTieIds($scope.tieIds);

        //execute sparql query
        var result = sparql.executeSparql();
        console.log(result);*/

        $scope.mapVisible = true;
        //add timeout. otherwise svg have not the right size
        $timeout(function() {
            map.initializeMap($scope.startDateMilliseconds, $scope.endDateMilliseconds, $scope);
        },50);

    }

    $scope.centerMap = function() {
        $scope.leafletMap.setView([47.00, 8.00], 8);
    }
});