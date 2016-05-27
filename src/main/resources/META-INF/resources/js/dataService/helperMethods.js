/**
 * Created by endtner on 27.05.2016.
 */

var helpers;
helpers = {
    getBounds: function(data) {
        var bounds = d3.geo.bounds();
        data.forEach(function (d) {
            bounds.extend(d.fromBusiness.coordinates);
            bounds.extend(d.toBusiness.coordinates);
        });
        return bounds;
    }
};
