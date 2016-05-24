function  Business(id, URI) {
    this.id = id;
    this.URI = URI;
    this.coordinates = null;

    this.getCoordinates = function(callback) {
        var coordinates = this.coordinates;
        if (this.coordinates == null) {
            var obj = this;

            $.ajax({
                url: "http://lindas.zazuko.com/blazegraph/namespace/swisstopo/sparql",
                dataType: "json",
                data: {
                    query: "SELECT ?wtk WHERE { " +
                    "?G <https://gont.ch/municipality> <http://classifications.data.admin.ch/municipality/37> ." +
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

        } else {
            callback(coordinates);
        }

    }
}
