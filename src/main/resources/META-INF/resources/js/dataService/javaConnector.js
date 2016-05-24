var javaConnector;
javaConnector = {

    startJavaApplication: function ($scope, callback) {
        var startDate = moment($scope.startDate, 'DD/MM/YYYY').toDate();
        startDate = moment(startDate).format("YYYY-MM-DD");

        var endDate = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        endDate = moment(endDate).format("YYYY-MM-DD");

        console.log($scope.startBusiness[0].URI);
        var businessString = "";
        for (var i = 0; i < $scope.startBusiness.length; i++) {
            businessString += "startingSite="+$scope.startBusiness[i].URI+"&";
        }
        console.log(businessString);

        $.ajax({
            type: "GET",
         //   dataType: "json",
            url: "/trace?"+businessString+"startDate="+startDate+"&endDate="+endDate,
            success: function(data){
                callback(data);
            }
        });
    }        
};
