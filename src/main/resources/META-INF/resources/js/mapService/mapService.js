app.service('map', function() {


    this.initializeMap = function (start, end, $scope) {
        $scope.appFinishedLoading = true;
        $scope.$apply();

        //initial value for filter
        $scope.filterStartDateMilliseconds = start;
        $scope.filterEndDateMilliseconds = end;

        var map;

        init();

        function init() {

            //Do this if loading map the first time
            if (olMap.getMap() == null) {
                olMap.preconfigureOpenLayers();
                olMap.createMap();
                olMap.addWMTSLayer("wmts_layer2", WMTSLayers.wmts_layer2.wmts_layer_options);
                olMap.zoomInAndSetCenter();
                olMap.initializeAllLayersButtons();
            }

            var map = olMap.getMap();

            var bounds = helpers.getBounds($scope.data);

            var overlay = new OpenLayers.Layer.Vector("movements");
            map.addLayer(overlay);

            d3Vis.drawVisualization(overlay, bounds, $scope, map);

            d3Vis.drawSlider([$scope.startDateMilliseconds, $scope.endDateMilliseconds], $scope);
            d3Vis.setAnimation($scope);
        }
    }



});