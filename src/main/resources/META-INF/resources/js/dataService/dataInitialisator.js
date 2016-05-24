var dataInitialisator;
dataInitialisator = {
    
    initializeData: function($scope) {
        console.log($scope.startDate);
        
        javaConnector.startJavaApplication($scope, function(data) {
            dataInitialisator.splitData(data);
        });
    },

    splitData: function(data) {
        console.log(data);
        var data = data.split(" .");
        console.log(data);
        
        var moveArray = [];

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
                return d.substring(b, c);
            }

            function parseFromBusiness (d) {
                var a = d.indexOf("fromLocation")+13;
                var b = d.indexOf('<', a);
                var c = d.indexOf('>', b) + 1;
                var uri = d.substring(b, c);

                var business = new Business(idToURIConverter.convertURIToId(uri), uri);
                business.getCoordinates(function() {});
                return business;
            }

            function parseToBusiness (d) {
                var a = d.indexOf("toLocation")+13;
                var b = d.indexOf('<', a);
                var c = d.indexOf('>', b) + 1;
                var uri = d.substring(b, c);

                var business = new Business(idToURIConverter.convertURIToId(uri), uri);
                business.getCoordinates(function() {});
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
            if (moveArray[moveArray.length - 1].toBusiness.coordinates != null) {
                console.log(moveArray);
                clearInterval(interval);
            }
        },10)
        


    }
    
};
