var app = angular.module('lindasMain', ["ngAnimate"]);

app.controller('lindasMainCtrl', function($scope, sparql, validator, map, $timeout) {
    //navigation
    $scope.nav = {
        eingabemaske: true,
        resultat: false,
        kontakt: false
    };
    
    //tie => tested infected entities
    $scope.tieIds = new Array({id:34155,valid:true});
    $scope.startDate = "01/01/2012";
    $scope.endDate = "20/02/2012";
    $scope.startDateMilliseconds = 0;
    $scope.endDateMilliseconds = 0;
    //difference in days between start- and enddate
    $scope.difference = null;
    $scope.dateInvalid = false;
    $scope.showMultipleIdMessage = false;

    $scope.forwardTracing = true;

    $scope.dataInitialisator = dataInitialisator;

    $scope.selectedExample = "Beispiel auswählen";
    $scope.timeoutSelectExample = false;

    $scope.initializeScope = function() {
        $scope.mapVisible = false;
        $scope.settingsVisible = false;
        $scope.filterStartDateMilliseconds = 0;
        $scope.filterEndDateMilliseconds = 0;
        $scope.leafletMap = {};
        $scope.originalData = [];
        $scope.animationRunning = false;
        $scope.data = [];
        $scope.centrality = [];
        $scope.allBusinessPoints = [];
        $scope.dataTable = {
            dataTable1: true,
            dataTable2: false
        };
        $scope.showDifferentForms = false;
        $scope.hideSlaughterhouse = false;
        $scope.individualArrowWidth = false;
        $scope.showAllBusinesses = false;
        $scope.showAllBusinessesSettings = false;
        $scope.maxAllBusinesses = 100;
        $scope.showCentrality = false;
        $scope.showNoCentralityMessage = false;

        $scope.startBusiness = [];

        $scope.appStarted = false;
        $scope.appFinishedLoading = false;
        $scope.showLayerPossibilities = false;
        $scope.showCentralityButton = false;

        $scope.noResults = false;

        $scope.displaySizeToSmall = false;
    };

    $scope.initializeScope();


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
    $scope.$watchGroup(['filterStartDateMilliseconds','filterEndDateMilliseconds', 'hideSlaughterhouse',
        'individualArrowWidth', 'showDifferentForms', 'showCentrality'], function(){
        
        if (!$scope.appStarted)
            return null;

        $scope.data = $scope.originalData.filter(function (d) {
            var date = d.date.getTime();
            if ($scope.hideSlaughterhouse)
                return (date >= $scope.filterStartDateMilliseconds && date <= $scope.filterEndDateMilliseconds
                && d.toBusiness.businessType.localeCompare("Schlachthof") != 0);
            else
                return (date >= $scope.filterStartDateMilliseconds && date <= $scope.filterEndDateMilliseconds);
        });
/*        try {
            d3Vis.update($scope);
        } catch (err) {
            console.log(err);
        }*/
        d3Vis.update($scope);

    });

    $scope.$watchGroup(['showAllBusinesses','maxAllBusinesses'], function() {

        if (!$scope.appStarted)
            return null;

        if ($scope.showAllBusinesses)
            loadAllBusinessPoints($scope, function() {
                d3Vis.update($scope)
            });
        else
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

        $scope.initializeScope();

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
            $scope.appStarted = false;
            return null;
        }

        //check if more than one id in forward tracing
        if ($scope.tieIds.length != 1 && $scope.forwardTracing) {
            $scope.appStarted = false;
            return null;
        }

        //validate Ids
        for (var i = 0; i < $scope.tieIds.length; i++) {
            if (validator.validateTieIds($scope.tieIds[i].id)) {
                $scope.tieIds[i].valid = true;
            } else {
                console.debug("invalid Id");
                $scope.appStarted = false;
                $scope.tieIds[i].valid = false;
                var invalid = true;
            }
        }
        if (invalid) {
            console.debug("Id invalid");
            $scope.appStarted = false;
            return null;
        }

        //add business for every tieId
        for (var i = 0; i < $scope.tieIds.length; i++) {
            var business = new Business($scope.tieIds[i].id, idToURIConverter.convertIdToURI($scope.tieIds[i].id));
            $scope.startBusiness.push(business);
            console.log(business);
        }

        //collect data for startbusinesses
        $scope.startBusiness.forEach(function(b) {
            b.getMunicipality(function() {
                b.getCoordinates(function() {});
            });
            b.getBusinessType(function() {});
        }) ;

        $scope.mapVisible = true;
        $scope.navigate('resultat');

        $scope.dataInitialisator.initializeData($scope, function(moveArray, centrality) {
            $scope.data = moveArray;
            $scope.centrality = centrality;
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
    
    $scope.selectExample = function(example) {
        $scope.selectedExample = example;
    };

    //change button to 'Beispiel auswählen' if user changes the settings
    $scope.$watchGroup(['startDate','endDate', 'forwardTracing'], function(){
        if ($scope.selectedExample.localeCompare('Beispiel auswählen') != 0 && !$scope.timeoutSelectExample) {
            $scope.selectedExample = 'Beispiel auswählen'
        }
    });

    $scope.$watch('tieIds', function () {
        if ($scope.selectedExample.localeCompare('Beispiel auswählen') != 0 && !$scope.timeoutSelectExample) {
            $scope.selectedExample = 'Beispiel auswählen'
        }
    }, true);

    $scope.$watch('selectedExample', function () {

        //do this to stop automatic button text change
        $scope.timeoutSelectExample = true;
        setTimeout(function() {
            $scope.timeoutSelectExample = false;
        }, 100);

        switch ($scope.selectedExample) {
            case 'Forward#1':
                $scope.startDate = "24/01/2012";
                $scope.endDate = "20/02/2012";
                $scope.tieIds = [{id:46132,valid:true}];
                $scope.forwardTracing = true;
                break;
            case 'Forward#2':
                $scope.startDate = "01/01/2012";
                $scope.endDate = "20/02/2012";
                $scope.tieIds = [{id:34155,valid:true}];
                $scope.forwardTracing = true;
                break;
            case 'Forward#3':
                $scope.startDate = "23/05/2012";
                $scope.endDate = "06/06/2012";
                $scope.tieIds = [{id:2336,valid:true}];
                $scope.forwardTracing = true;
                break;
            case 'Backward#1':
                $scope.startDate = "01/01/2012";
                $scope.endDate = "10/01/2012";
                $scope.tieIds = [{id:33360,valid:true},{id:3782,valid:true},{id:28938,valid:true}];
                $scope.forwardTracing = false;
                break;
            case 'Backward#2':
                $scope.startDate = "01/01/2012";
                $scope.endDate = "02/01/2012";
                $scope.tieIds = [{id:41564,valid:true},{id:42712,valid:true}];
                $scope.forwardTracing = false;
                break;
        }
    });

    $(window).resize(function(){
        $scope.$apply(function(){
            $scope.testIfScreenResolutionEnough(window.innerWidth);
        });
    });

    $(window).ready(function(){
        $scope.$apply(function(){
            $scope.testIfScreenResolutionEnough(window.innerWidth);
            $("#lindasMainContainer").css("display","block");
        });
    });

    $scope.testIfScreenResolutionEnough = function(width) {
        if (width <= 1200) {
            $scope.displaySizeToSmall = true;
            $("#screenResolutionToSmall").show();
        } else {
            $scope.displaySizeToSmall = false;
            $("#screenResolutionToSmall").hide();
        }
    }

});

function showScope() {
    console.log(angular.element(document.getElementById('lindasMainContainer')).scope());
}

