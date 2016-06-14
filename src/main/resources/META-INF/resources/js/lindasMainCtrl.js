var app = angular.module('lindasMain', ["ngAnimate"]);

app.controller('lindasMainCtrl', function($scope, sparql, validator, map, $timeout) {
    //navigation
    $scope.nav = {
        eingabemaske: true,
        resultat: false,
        kontakt: false
    }
    
    //tie => tested infected entities
    $scope.tieIds = new Array({id:34155,valid:true});
    $scope.startDate = "01/01/2012";
    $scope.endDate = "20/02/2012";
    $scope.startDateMilliseconds = 0;
    $scope.endDateMilliseconds = 0;
    $scope.value = "initialize";
    //difference in days between start- and enddate
    $scope.difference = null;
    $scope.dateInvalid = false;
    //set this to false at end
    $scope.mapVisible = false;
    $scope.settingsVisible = false;
    $scope.filterStartDateMilliseconds = 0;
    $scope.filterEndDateMilliseconds = 0;
    $scope.leafletMap = {};
    $scope.originalData = [];
    $scope.animationRunning = false;
    $scope.data = [];
    $scope.dataTable = {
        dataTable1: true,
        dataTable2: false,
    };
    $scope.showDifferentForms = false;
    $scope.hideSlaughterhouse = false;
    $scope.individualArrowWidth = false;
    $scope.appStarted = false;
    $scope.appFinishedLoading = false;
    $scope.showProtectionZone = false;
    $scope.showMonitoringZone = false;
    $scope.showLayerPossibilities = false;
    $scope.startBusiness = [];

    $scope.forwardTracing = true;

    $scope.dataInitialisator = dataInitialisator;

    $scope.noResults = false;
    
    $scope.navigate = function(page) {
        $scope.nav.eingabemaske = false;
        $scope.nav.resultat = false;
        $scope.nav.kontakt = false;
        $scope.nav[page] = true;
    };
    
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

    $scope.calculateDifference = function() {
        if ($scope.difference == 0)
            return null;
        var d = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        d.setDate(d.getDate()-$scope.difference);
        $scope.startDate = moment(d).format('DD/MM/YYYY');
    };

    //draw Visualization again if something in Settings change
    $scope.$watchGroup(['filterStartDateMilliseconds','filterEndDateMilliseconds', 'hideSlaughterhouse', 'individualArrowWidth', 'showDifferentForms', 'showProtectionZone'], function(){
        if (!$scope.appStarted)
            return null;

        $scope.data = $scope.originalData.filter(function (d) {
            var date = d.date.getTime();
            if ($scope.hideSlaughterhouse)
                return (date > $scope.filterStartDateMilliseconds && date < $scope.filterEndDateMilliseconds
                && d.toBusiness.businessType.localeCompare("Schlachthof") != 0);
            else
                return (date > $scope.filterStartDateMilliseconds && date < $scope.filterEndDateMilliseconds);
        });
/*        try {
            d3Vis.update($scope);
        } catch (err) {
            console.log(err);
        }*/
        d3Vis.update($scope);

    });

    //convert startDate to Milliseconds since 01.01.1970
    $scope.$watch('startDate',function() {
        $scope.getMillisecondsStartDate();
    });

    //convert endDate to Milliseconds since 01.01.1970
    $scope.$watch('startDate',function() {
        $scope.getMillisecondsEndDate();
    });

    $scope.getMillisecondsEndDate = function() {
        $scope.endDateMilliseconds = moment($scope.endDate, "DD/MM/YYYY").toDate().getTime();
    };

    $scope.getMillisecondsStartDate = function() {
        $scope.startDateMilliseconds = moment($scope.startDate,"DD/MM/YYYY").toDate().getTime();
    };

    $scope.initializeVisualisation = function(forwardTracing) {
        console.log("start Visualization");
        $scope.appStarted = true;
        $scope.getMillisecondsEndDate();
        $scope.getMillisecondsStartDate();

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

        for (var i = 0; i < $scope.tieIds.length; i++) {
            var business = new Business($scope.tieIds[i].id, idToURIConverter.convertIdToURI($scope.tieIds[i].id));
            business.getMunicipality(function() {
                business.getCoordinates(function() {});
            });
            business.getBusinessType(function() {});

            $scope.startBusiness.push(business);
        }

        $scope.mapVisible = true;
        $scope.navigate('resultat');

        $scope.dataInitialisator.initializeData($scope, function(moveArray) {
            $scope.data = moveArray;
            $scope.originalData = moveArray;
            console.log($scope.data);

            if ($scope.data.length == 0) {
                $scope.noResults = true;
                $scope.appFinishedLoading = true;
                $scope.$apply();
            } else {
                $scope.noResults = false;
                //add timeout. otherwise svg have not the right size
                $timeout(function() {
                    map.initializeMap($scope.startDateMilliseconds, $scope.endDateMilliseconds, $scope);
                },50);
            }
        });
    };

    $scope.centerMap = function() {
        $scope.map.setView(new ol.View({
            resolution: 450,
            center: [680000, 185655],
            extent: [430250, 73155, 929750, 298155]
        }));
    };

    $scope.changeDataTable= function(table) {
        $scope.dataTable.dataTable1 = false;
        $scope.dataTable.dataTable2 = false;
        $scope.dataTable[table] = true;
    };

    $scope.toggleLayersVisibility = function() {
        $scope.showLayerPossibilities ? $scope.showLayerPossibilities = false : $scope.showLayerPossibilities = true;
        console.log($scope.showLayerPossibilities);
    };

    $scope.changeForwardTracing = function() {
        ($scope.forwardTracing) ? $scope.forwardTracing = false : $scope.forwardTracing = true;
    };
    
    $scope.toggleForwardTracing = function(forward) {
        $scope.forwardTracing = forward;
    };
});