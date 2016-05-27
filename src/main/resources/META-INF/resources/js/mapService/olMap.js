var olMap;
olMap = {

    layerName: "",
    layer: null,
    loadLayerRunning: false,

    preconfigureOpenLayers: function () {
        // Add the LV03 projection as it is not defined in OL
        Proj4js.defs["EPSG:21781"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
        // I prefer olMap style to the OL default...
        OpenLayers.ImgPath = "https://www.procrastinatio.org/mf-chsdi-build/GeoAdmin.ux/Map/img/";
    },

    map_options: {
        div: "map",
        projection: "EPSG:21781", //CH LV03 Projection
        units: "m",
        controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.ScaleLine({
            maxWidth: 120
        })],
        restrictedExtent: new OpenLayers.Bounds(420230, 68940, 930830, 298940),
        resolutions: [500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
    },

    createMap: function () {
        olMap.map = new OpenLayers.Map(olMap.map_options);
        olMap.map.events.register('zoomend', olMap.map, olMap.startEventOnZoom);
    },

    getMap: function () {
        return olMap.map;
    },

    getCenter: function() {
        return olMap.map.getCenter();
    },

    getExtent: function() {
        return olMap.map.getExtent();
    },


    addWMTSLayer: function (layerName, layerOptions) {
        olMap.layerName = layerName;
        // Create a WMTS layer using our resolutions
        var wmtsLayer = new OpenLayers.Layer.WMTS(layerOptions);
        olMap.addLayer(wmtsLayer);
    },

    addLayer: function(layer) {
        olMap.map.addLayer(layer);
        olMap.layer = layer;
    },
    
    initializeAllLayersButtons: function() {
        for(var key in WMTSLayers) {
            var value = WMTSLayers[key];
            if (value.visible) {
                var strButton = "";
                strButton += "<button onclick=\"olMap.changeWMTSLayerAfterCheck(\'" + key + "\',this)\" type=\"button\" style=\"background-image: url('" + value.img_url + "')\" class=\"btn btn-default btn-circle btn-lg mapButton\"><\/button>";

                $("#allLayersBox").append(strButton);
            }
        }
        $(".mapButton").eq(0).addClass('activeCircle');
    },

    zoomInAndSetCenter: function(){
        //olMap.map.zoomIn();
        olMap.map.setCenter(new OpenLayers.LonLat(675530,183940), 14);
        olMap.map.zoomTo(0);
    },

    changeWMTSLayer: function(layerName) {
        // layerName = olMap.switchLayerIfNeeded(layerName);
        var zoom = olMap.map.getZoom();
        olMap.map.removeLayer(olMap.layer);
        olMap.layerName = "";
        olMap.addWMTSLayer(layerName, WMTSLayers[layerName].wmts_layer_options);
        olMap.map.setOptions({restrictedExtent: WMTSLayers[layerName].restrictedExtent});
        olMap.map.zoomTo(zoom);
        olMap.loadLayerRunning = false;
    },

    changeWMTSLayerAfterCheck: function (layerName, obj) {
        olMap.loadLayerRunning = true;
        $(".activeCircle").removeClass('activeCircle');
        $(obj).addClass('activeCircle');

        var zoom = olMap.map.getZoom();
        if (layerName.localeCompare("wmts_layer2") == 0 && zoom != 0) {
            olMap.changeWMTSLayer("wmts_layer1");
        } else if (layerName.localeCompare("wmts_layer1") == 0 && zoom == 0) {
            olMap.changeWMTSLayer("wmts_layer2");
        } else {
            olMap.changeWMTSLayer(layerName);
        }
    },

    startEventOnZoom: function() {
        if (!olMap.loadLayerRunning) {
            olMap.loadLayerRunning = true;
            var zoom = olMap.map.getZoom();
            var map = $("#map");
            if (zoom != 0) {
                //set this again after fixing the bug
                /*map.css("width", "100%");
                map.css("left", "0");*/

                if (olMap.layerName.localeCompare("wmts_layer2") == 0) {
                    olMap.changeWMTSLayer("wmts_layer1");
                }

            } else {
                map.css("width", "90%");
                map.css("left", "5%");

                if (olMap.layerName.localeCompare("wmts_layer1") == 0) {
                    olMap.changeWMTSLayer("wmts_layer2");
                }
            }
            olMap.map.zoomTo(zoom);
        }
    }
    
    

};
