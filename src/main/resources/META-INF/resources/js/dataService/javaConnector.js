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
        console.log("/trace?"+businessString+"startDate="+startDate+"&endDate="+endDate);

        $.ajax({
            type: "GET",
         //   dataType: "json",
            url: "/trace?"+businessString+"startDate="+startDate+"&endDate="+endDate,
            success: function(data){
                callback(data);
            }
        });
    },

    startBackwardsTracing: function (callback) {

        $.ajax({
            type: "GET",
            //   dataType: "json",
            url: "/centrality?startingSite=http://foodsafety.data.admin.ch/business/5112&startingSite=http://foodsafety.data.admin.ch/business/51122&startDate=2012-02-01&endDate=2012-01-20",
            success: function(data){
                callback(data);
            }
        });
    }
};
