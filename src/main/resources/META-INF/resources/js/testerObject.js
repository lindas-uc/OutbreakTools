var test = {
    testInitializeVisualisation: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "01/01/2012";
        app.endDate = "29/04/2013";
        app.tieIds = [{id:2000,valid:true},{id:3000,valid:true},{id:5000,valid:true}];

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

    testAddCoordinates: function () {
        var business1 = new Business(51122, idToURIConverter.convertIdToURI(51122));
        var business2 = new Business(51396, idToURIConverter.convertIdToURI(51396));

        business1.getCoordinates(function (coordinates) {
            console.log(coordinates)
        });
        console.log(business2.getCoordinates(function (coordinates) {
            console.log(coordinates)
        }));
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

    }
};