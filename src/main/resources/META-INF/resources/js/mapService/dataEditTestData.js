var dataEditTestData;
dataEditTestData = {

    bounds: {},

    loadCSVData: function(callback) {
        d3.csv("testdata/testdata3.csv", function(data) {
            callback(data);
            return data;
        });
    },

    convertCSVDataAndCreateBounds: function(data) {
        var bounds = new OpenLayers.Bounds();

        d3.json("js/mapService/boundaries2.json",function(collection) {
            bounds = d3.geo.bounds(collection)
        });

        data.forEach(function (d) {
            bounds.extend(new OpenLayers.LonLat(d.A_lon, d.A_lat));
            bounds.extend(new OpenLayers.LonLat(d.B_lon, d.B_lat));
            d.A_LonLat = new OpenLayers.LonLat(d.A_lon, d.A_lat);
            d.B_LonLat = new OpenLayers.LonLat(d.B_lon, d.B_lat);
            d.Date = moment(d.Date.substring(0, 10), "YYYY-MM-DDTZD").toDate();
        });

        this.bounds = bounds;
        return data;
    },

    getBounds: function() {
        return this.bounds.toArray();
    }

};