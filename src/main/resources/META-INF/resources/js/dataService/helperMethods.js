/**
 * Created by endtner on 27.05.2016.
 */

var helpers;
helpers = {
    getBounds: function(data) {
        var bounds = new OpenLayers.Bounds();
        data.forEach(function (d) {
            bounds.extend(d.fromBusiness.openLayersLonLat);
            bounds.extend(d.toBusiness.openLayersLonLat);
        });
        return bounds;
    },
    
    /*makeUniqueBusinessCircles: function (data) {
        var uniqueData = [];
        for (var i = 0; i < data.length; i++) {
            var found = false;
            for (var j = 0; j < uniqueData.length; j++) {
                if (data[i].localeCompare(uniqueData[j]) || data[i].localeCompare(uniqueData[j])) {
                    found = true;
                }
            }
            if (!found) {
                uniqueData.push(data[i]);
            }
        }
    }*/
};
