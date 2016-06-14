function  Business(id, URI) {
    this.id = id;
    this.URI = URI;
    this.coordinates = null;
    this.municipality = null;
    this.name = "randomName";
    this.openLayersLonLat = {};
    this.businessType = null;
    this.startingSite = false;

    this.getMunicipality = function(callback) {
        if (this.municipality == null) {
            var obj = this;

            $.ajax({
                url: "http://test.lindas-data.ch/sparql",
                dataType: "json",
                data: {
                    query: "SELECT DISTINCT * FROM <http://test.lindas-data.ch/resource/animaltransports> WHERE "
                    + "{" + obj.URI + " <https://gont.ch/municipality> ?o}"
                }
            }).then(function (data) {
                console.log(data);
                try {
                    data = data["results"]["bindings"][0]["o"]["value"];
                    data = "<" + data + ">";
                    obj.municipality = data;
                    callback(obj.municipality);
                } catch (err) {
                    console.log("Cannot find municipality of of object "+obj.URI);
                    obj.municipality = "no value";
                    callback(obj.municipality);
                }
            });

        } else {
            callback(this.municipality);
        }
    };

    this.getCoordinates = function(callback) {
        //create new coordinates if doesn't exist
        if (this.coordinates == null) {
            //didnt found municipality. return random coordinates
            if (this.municipality.localeCompare("no value") == 0) {
                console.log("Object " + this.URI + " has no municipality, so return random coordinates");
                this.returnNullCoordinates(callback);
            } else {
                var coordinates = this.coordinates;
                var obj = this;

                this.getMunicipality(function (municipality) {
                    $.ajax({
                        url: "http://lindas.zazuko.com/blazegraph/namespace/swisstopo/sparql",
                        dataType: "json",
                        data: {
                            query: "SELECT ?wtk WHERE { " +
                            "?G <https://gont.ch/municipality> " + municipality + " ." +
                            "?G    <http://linkeddata.interlis.ch/IlisMeta07.MetaElemOID/swissBOUNDARIES3D_ili2_LV03_V1_3_ceis.TLM_GRENZEN.TLM_HOHEITSGEBIET.RefPoint> ?S." +
                            "?S <http://www.opengis.net/ont/geosparql#asWKT> ?wtk}"
                        }
                    }).then(function (data) {
                       try {
                            data = data["results"]["bindings"][0]["wtk"]["value"];
                            data = data.substring(data.search("POINT") + 8, data.length - 2);
                            data = data.split(" ");
                            data[0] = parseInt(data[0]);
                            data[1] = parseInt(data[1]);
                            obj.coordinates = data;
                            obj.openLayersLonLat = new OpenLayers.LonLat(data);
                            callback(obj.coordinates);
                            //didn't found coordinates. return random coordinates
                        } catch (err) {
                            console.log("Object " + obj.URI + " has no coordinates, so return random coordinates");
                            obj.returnNullCoordinates(callback);
                        }
                    });
                });
            }
        } else {
            callback(this.coordinates);
        }
    };

    this.returnNullCoordinates = function (callback) {
        var x = this.id / 60000 * 347574 + 486278;
        var y = 77154 + (this.id % 10) * 216022 / 10;

/*        var x = 0;
        var y = 0;*/

        this.coordinates = [x, y];
        this.openLayersLonLat = new OpenLayers.LonLat(x, y);
        callback([x, y]);
    };

    this.getBusinessType = function(callback) {
        var obj = this;

        //delete the following line
       // this.businessType = translateBusinessType("loeschen");

        if (this.businessType == null) {
            $.ajax({
                url: "http://test.lindas-data.ch/sparql",
                dataType: "json",
                data: {
                    query: "SELECT DISTINCT * FROM <http://test.lindas-data.ch/resource/animaltransports> WHERE "
                    +"{"+obj.URI+" <http://blv.ch/cat> ?o}"
                }
            }).then(function(data) {
                try {
                    data = translateBusinessType(data["results"]["bindings"][0]["o"]["value"]);
                    obj.businessType = data;
                } catch (err) {
                    console.log("no businesstype found");
                    obj.businessType = "missing_businesstype";
                } finally {
                    callback(obj.businessType);
                }

            });

        } else {
            callback(this.businessType);
        }

        function translateBusinessType(uri) {
            var value = parseInt(obj.id) % 4;
            if (value == 0)
                return "Schlachthof";
            else if (value == 1)
                return "Viehmarkt";
            else if (value == 2)
                return "Tierhaltung";
            else
                return "Alpung";
        }
    }
}
