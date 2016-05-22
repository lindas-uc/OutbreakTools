app.service('map', function() {


    this.initializeMap = function (start, end, $scope) {

        //initial value for filter
        $scope.filterStartDateMilliseconds = start;
        $scope.filterEndDateMilliseconds = end;

        var map;

        init();

        function init() {


            olMap.preconfigureOpenLayers();
            olMap.createMap();
            olMap.addWMTSLayer("wmts_layer2",WMTSLayers.wmts_layer2.wmts_layer_options);
            olMap.zoomInAndSetCenter();
            olMap.initializeAllLayersButtons();

            var map = olMap.getMap();

            dataEdit.loadCSVData(function (data) {
                $scope.originalData = data;

                data = dataEdit.convertCSVDataAndCreateBounds(data);
                $scope.data = data;
                bounds = dataEdit.getBounds();

                var overlay = new OpenLayers.Layer.Vector("movements");
                map.addLayer(overlay);

                d3Vis.drawVisualization(overlay, bounds, $scope, map);

            });

            d3Vis.drawSlider([$scope.startDateMilliseconds, $scope.endDateMilliseconds], $scope);
            d3Vis.setAnimation($scope);
        }
    }



});