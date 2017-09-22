var dataInitialisator;
dataInitialisator = {

    $scope: null,
    
    initializeData: function($scope, callback) {
        console.log($scope.startDate);
        dataInitialisator.$scope = $scope;

        if ($scope.forwardTracing) {
            javaConnector.startJavaApplicationForward($scope, function (data) {
                dataInitialisator.splitData(data, callback);
            });
        } else {
            javaConnector.startJavaApplicationBackward($scope, function(data) {
                dataInitialisator.splitData(data, callback);
            });
        }
    },

    splitData: function(data, callback) {
        console.log(data);
        var data = data.split(" .");
        var moveArray = [];
        var centrality = [];

        for (var i = 0 ; i < data.length; i++) {
            if (data[i].indexOf("foodsafety.data.admin.ch/move") >= 0) {
                centrality.push(dataInitialisator.parseValue(data[i]));
            }
        }

        for (var i = 0 ; i < data.length; i++) {
            if (data[i].indexOf("move") === -1)
                data.splice(i, 1);
        }

        for (var i = 0 ; i < data.length; i++) {

            function parseId (d) {
                var a = d.indexOf("move/")+5;
                var b = d.indexOf(">", a);
                return parseInt(d.substring(a, b));
            }

            function parseDate(d) {
                var a = d.indexOf("date");
                var b = d.indexOf('"', a) + 1;
                var c = d.indexOf('"', b+1);
                return moment(d.substring(b, c), "YYYY-MM-DD").toDate();
            }

            function parseFromBusiness (d) {
                var a = d.indexOf("fromLocation")+13;
                var b = d.indexOf('<', a);
                var c = d.indexOf('>', b) + 1;
                var uri = d.substring(b, c);

                var business = new Business(idToURIConverter.convertURIToId(uri), uri);
                business.getMunicipality(function() {
                    business.getCoordinates(function() {});
                    business.getCanton(function() {});
                });
                business.getBusinessType(function() {});
                return business;
            }

            function parseToBusiness (d) {
                var a = d.indexOf("toLocation")+13;
                var b = d.indexOf('<', a);
                var c = d.indexOf('>', b) + 1;
                var uri = d.substring(b, c);

                var business = new Business(idToURIConverter.convertURIToId(uri), uri);
                business.getMunicipality(function() {
                    business.getCoordinates(function() {});
                    business.getCanton(function() {});
                });
                business.getBusinessType(function() {});
                return business;
            }

            moveArray.push(new Move(
                parseId(data[i]),
                parseFromBusiness(data[i]),
                parseToBusiness(data[i]),
                parseDate(data[i])
            ));
        }

        var interval = setInterval(function() {
            var found = true;
            for (var i = 0; i < moveArray.length && found; i++) {
                if (moveArray[i].toBusiness.coordinates === null || moveArray[i].fromBusiness.coordinates === null) {
                    found = false;
                }
            }
            if (found) {
                clearInterval(interval);
                console.log(centrality);
                callback(moveArray, centrality);
            }
        },10)

    },

    parseValue: function(valueBlock) {
        var centrality = valueBlock.substring(valueBlock.indexOf("ns#value")+10,valueBlock.indexOf("^^<"));
        centrality = centrality.trim();
        centrality = centrality.substring(1,centrality.length-1);
        centrality = parseFloat(centrality);
        console.log(centrality);

        var a = valueBlock.indexOf("subject")+10;
        var b = valueBlock.indexOf('<', a);
        var c = valueBlock.indexOf('>', b) + 1;
        var uri = valueBlock.substring(b, c);

        return [centrality,uri];
    }
    
};
