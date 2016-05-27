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
                            +"{"+obj.URI+" <https://gont.ch/municipality> ?o}"
                }
            }).then(function(data) {
                console.log(data);
                data = data["results"]["bindings"][0]["o"]["value"];
                data = "<" + data + ">";
                obj.municipality = data;
                callback(obj.municipality);
            });

        } else {
            callback(this.municipality);
        }
    };

    this.getCoordinates = function(callback) {
        /*var coordinates = this.coordinates;
        if (this.coordinates == null) {
            var obj = this;

            this.getMunicipality(function(municipality) {
                console.log(municipality);
                $.ajax({
                    url: "http://lindas.zazuko.com/blazegraph/namespace/swisstopo/sparql",
                    dataType: "json",
                    data: {
                        query: "SELECT ?wtk WHERE { " +
                        "?G <https://gont.ch/municipality> "+municipality+" ." +
                        "?G    <http://linkeddata.interlis.ch/IlisMeta07.MetaElemOID/swissBOUNDARIES3D_ili2_LV03_V1_3_ceis.TLM_GRENZEN.TLM_HOHEITSGEBIET.RefPoint> ?S." +
                        "?S <http://www.opengis.net/ont/geosparql#asWKT> ?wtk}"

                    }
                }).then(function(data) {
                    data = data["results"]["bindings"][0]["wtk"]["value"];
                    data =  data.substring(data.search("POINT") + 8, data.length-2);
                    data = data.split(" ");
                    obj.coordinates = data;
                    callback(obj.coordinates);
                });
            });

        } else {
            callback(coordinates);
        }*/

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        var randX = getRandomArbitrary(486278,833852);
        var randY = getRandomArbitrary(77154,293176);

        this.coordinates = [randX, randY];
        this.openLayersLonLat = new OpenLayers.LonLat(randX, randY);
        callback([randX, randY]);

    };

    this.getBusinessType = function(callback) {
        //delete the following line
        this.businessType = translateBusinessType("loeschen");

        if (this.businessType == null) {
            var obj = this;

            $.ajax({
                url: "http://test.lindas-data.ch/sparql",
                dataType: "json",
                data: {
                    query: "SELECT DISTINCT * FROM <http://test.lindas-data.ch/resource/animaltransports> WHERE "
                    +"{"+obj.URI+" <http://blv.ch/cat> ?o}"
                }
            }).then(function(data) {

                data = translateBusinessType(data["results"]["bindings"][0]["o"]["value"]);
                console.log(data);
                obj.businessType = data;
                callback(obj.businessType);
            });

        } else {
            callback(this.businessType);
        }


        function translateBusinessType(uri) {
            var rand = Math.random();
            if (rand <= 0.25)
                return "Schlachthof";
            else if (rand > 0.25 && rand <= 0.5)
                return "Viehmarkt";
            else if (rand > 0.25 && rand <= 0.75)
                return "Tierhaltung";
            else
                return "Alpung";
        }
    };
}
