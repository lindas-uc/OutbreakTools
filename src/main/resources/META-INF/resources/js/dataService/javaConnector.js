var javaConnector;
javaConnector = {

    startJavaApplicationForward: function ($scope, callback) {
        var startDate = moment($scope.startDate, 'DD/MM/YYYY').toDate();
        startDate = moment(startDate).format("YYYY-MM-DD");

        var endDate = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        endDate = moment(endDate).format("YYYY-MM-DD");

        console.log($scope.startBusiness[0].URI);
        var businessString = "";
        for (var i = 0; i < $scope.startBusiness.length; i++) {
            var uri = $scope.startBusiness[i].URI;
            businessString += "startingSite="+uri.substring(1,uri.length - 1)+"&";
        }
        console.log(businessString);
        console.log("/trace?"+businessString+"startDate="+startDate+"&endDate="+endDate);

        $.ajax({
            type: "GET",
         //   dataType: "json",
            url: "/trace?"+businessString+"startDate="+startDate+"&endDate="+endDate,
            success: function(data){
                callback(data);
            },
            error: function (request, status, error) {
                // FEHLERCODE 101
                console.log(request.responseText)
                alert("Ein Fehler ist aufgetreten. (Fehlercode 101) \nFalls dieses Problem weiterhin auftritt, " +
                    "wenden Sie sich bitte and die Forschungsstelle Digitale Nachhaltigkeit")
            }
        });
    },

    startJavaApplicationBackward: function ($scope, callback) {

        var startDate = moment($scope.startDate, 'DD/MM/YYYY').toDate();
        startDate = moment(startDate).format("YYYY-MM-DD");

        var endDate = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        endDate = moment(endDate).format("YYYY-MM-DD");

        console.log($scope.startBusiness[0].URI);
        var businessString = "";
        for (var i = 0; i < $scope.startBusiness.length; i++) {
            var uri = $scope.startBusiness[i].URI;
            businessString += "startingSite="+uri.substring(1,uri.length - 1)+"&";
        }
        console.log(businessString);
        console.log("/centrality?"+businessString+"startDate="+startDate+"&endDate="+endDate);

        $.ajax({
            type: "GET",
            //   dataType: "json",
            //switch start and enddate. algorithm need enddate as startdate.
            url: "/centrality?"+businessString+"startDate="+endDate+"&endDate="+startDate,
            success: function(data){
                callback(data);
            },
            error: function (request, status, error) {
                // FEHLERCODE 102
                console.log(request.responseText)
                alert("Ein Fehler ist aufgetreten. (Fehlercode 102) \nFalls dieses Problem weiterhin auftritt, " +
                    "wenden Sie sich bitte and die Forschungsstelle Digitale Nachhaltigkeit")
            }
        });
    }
};
