var test = {

    assertEquals: function (a,b) {
        if (JSON.stringify(a).localeCompare(JSON.stringify(b)) == 0) {
            console.log("test successful");
        } else {
            console.log("test failed");
        }

        console.log(JSON.stringify(a));
        console.log(JSON.stringify(b));

    },


    testInitializeVisualisation: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        (app.forwardTracing) ? test.testInitializeVisualisationForward() : test.testInitializeVisualisationBackward();
    },

    loadBackwardSettings: function () {
        var element = $("#lindasMainContainer");
        var $scope = angular.element(element).scope();
        $scope.startDate = "01/01/2012";
        $scope.endDate = "10/01/2012";
        $scope.forwardTracing = false;
        $scope.tieIds = [{id:33360,valid:true}];
        $scope.$apply();
    },

    testInitializeVisualisationForward: function() {
        console.log("forward");
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "01/01/2012";
        app.endDate = "05/01/2012";
        app.tieIds = [{id:51396,valid:true}];
        app.forwardTracing = true;

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);

    },

    testInitializeVisualisationBackward: function() {
        console.log("backward");
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "20/01/2012";
        app.endDate = "01/02/2012";
        app.tieIds = [{id:5112,valid:true},{id:51122,valid:true}];
        app.forwardTracing = false;

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);

    },
    
    testJsonData: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.dataInitialisator = dataInitialisatorTestData;

        app.startDate = "01/01/2012";
        app.endDate = "31/01/2012";
        app.tieIds = [{id:5112,valid:true},{id:51122,valid:true}];
        app.forwardTracing = false;

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);

        
    },

    testDate: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "01/01/2012";
        app.endDate = "29/04/2013";
        app.difference = 30;
        app.tieIds = [{id:2000,valid:true},{id:3000,valid:true},{id:5000,valid:true}];

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);
    },
    
    testJavaConnector: function() {
        console.log("starting test javaConnector");
        var element = $("#lindasMainContainer");
        var $scope = angular.element(element).scope();
        $scope.startDate = "01/01/2012";
        $scope.endDate = "02/01/2012";

        var businessURI = "http://foodsafety.data.admin.ch/business/51122";

        javaConnector.startJavaApplication($scope, businessURIs, function(data) {
            console.log(data);
        });
    },

    testBusinessObject: function() {
        var business1 = new Business(51122, idToURIConverter.convertIdToURI(51122));
        var business2 = new Business(51396, idToURIConverter.convertIdToURI(51396));
        var business3 = new Business(51366, idToURIConverter.convertIdToURI(51366));

        console.log(business1);
        console.log(business3);
        console.log(business2);
    },

    testAddMunicipalitiy: function() {
        var business1 = new Business(2251, idToURIConverter.convertIdToURI(2251));
        var business2 = new Business(51396, idToURIConverter.convertIdToURI(51396));

        business1.getMunicipality(function (muni) {
            console.log(muni)
        });
    },

    testAddCoordinates: function () {
        var business1 = new Business(51122, idToURIConverter.convertIdToURI(51122));
        var business2 = new Business(51396, idToURIConverter.convertIdToURI(51396));
        business2.municipality = "no value";
        business1.municipality = "<http://classifications.data.admin.ch/municipality/2198>";

        business1.getCoordinates(function (coordinates) {
            console.log(coordinates)
        });
        console.log(business2.getCoordinates(function (coordinates) {
            console.log(coordinates)
        }));
    },

    testAddBusinessType: function () {
        var business1 = new Business(51122, idToURIConverter.convertIdToURI(51122));
        var business2 = new Business(51396, idToURIConverter.convertIdToURI(51396));

        business1.getBusinessType(function (bType) {
            console.log(bType)
        });
        business2.getBusinessType(function (bType) {
            console.log(bType)
        });
    },

    testPerformanceAddCoordinates: function () {
        var time = new Date().getTime();
        var coord = [];
        var number = 200;
        for (var i = 0; i <= number; i++) {
            var business = new Business(51122, idToURIConverter.convertIdToURI(51122));
            business.getCoordinates(function (coordinates) {
                coord.push(coordinates);
            });
        }
        var interval = setInterval(function() {
            if (coord.length == number) {
                console.log(new Date().getTime() - time);
                console.log(coord);
                clearInterval(interval);
            }
        }, 50)
    },

    testRealData: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "01/01/2012";
        app.endDate = "05/01/2012";
        app.tieIds = [{id:51122,valid:true}];

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);

    },

    testBackwardsTracing: function() {
       javaConnector.startBackwardsTracing(function(data) {
           console.log(data);
       })

    }
};