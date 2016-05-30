/**
 * Created by endtner on 30.05.2016.
 */
var dataInitialisatorTestData;
dataInitialisatorTestData = {
    initializeData: function($scope, callback) {
        console.log($scope.startDate);
        console.log("testData");

        d3.json("js/dataService/testData.json", function (data) {
            for (var i = 0; i < data.length; i++) {
                var x = data[i].fromBusiness.coordinates[0];
                var y = data[i].fromBusiness.coordinates[1];
                data[i].fromBusiness.openLayersLonLat = new OpenLayers.LonLat(x, y);
                x = data[i].toBusiness.coordinates[0];
                y = data[i].toBusiness.coordinates[1];
                data[i].toBusiness.openLayersLonLat = new OpenLayers.LonLat(x, y);
                data[i].date = new Date(data[i].date);
            }
            callback(data);
        });
    }
};