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
    }
};
