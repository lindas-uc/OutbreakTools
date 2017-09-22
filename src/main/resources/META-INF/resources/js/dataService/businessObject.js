var errorOccured = false;

function  Business(id, URI) {
    this.id = id;
    this.URI = URI;
    this.coordinates = null;
    this.municipality = null;
    this.canton = null;
    this.name = "randomName";
    this.openLayersLonLat = {};
    this.businessType = null;
    this.startingSite = false;
    this.centrality = 0;

    this.getMunicipality = function(callback) {
        if (this.municipality === null) {
            var obj = this;
            console.log("SELECT DISTINCT * FROM <https://linked.opendata.swiss/graph/FSVO/outbreak> WHERE "
            + "{" + obj.URI + " <https://gont.ch/municipality> ?o}");
            
            $.ajax({
                url: "https://lindas-data.ch/sparql/",
                headers: {
                    Accept: "application/sparql-results+json"
                },
                dataType: "json",
                data: { 
                    query: "SELECT DISTINCT * FROM <https://linked.opendata.swiss/graph/FSVO/outbreak> WHERE "
                    + "{" + obj.URI + " <https://gont.ch/municipality> ?o}"
                },
                error: function (request, status, error) {
                    debugger;
                    // FEHLERCODE 201
                    if (!errorOccured) {
                        errorOccured = true;
                        console.log(request.responseText)
                        alert("Ein Fehler ist aufgetreten. (Fehlercode 201) \nFalls dieses Problem weiterhin auftritt, " +
                            "wenden Sie sich bitte and die Forschungsstelle Digitale Nachhaltigkeit")
                    }
                }
            }).then(function (data) {
                debugger;
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
        if (this.coordinates === null) {
            //didnt found municipality. return random coordinates
            if (this.municipality.localeCompare("no value") === 0) {
                console.log("Object " + this.URI + " has no municipality, so return random coordinates");
                this.returnNullCoordinates(callback);
            } else {
                var coordinates = this.coordinates;
                var obj = this;

                this.getMunicipality(function (municipality) {

                    $.ajax({
                        url: "https://ld.geo.admin.ch/query/",
                        headers: {
                            Accept: "application/sparql-results+json"
                        },
                        dataType: "json",
                        data: {
                            query: "SELECT ?wkt WHERE {"
                            +"?geomuni <http://www.w3.org/2000/01/rdf-schema#seeAlso> "+municipality+"."
                            +"?geomuni <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.geonames.org/ontology#A.ADM3>."
                            +"?geomuni <http://purl.org/dc/terms/hasVersion> ?geomuniVersion ."

                            +"?geomuniVersion <http://purl.org/dc/terms/issued> ?issued."
                            +"?geomuniVersion <http://www.opengis.net/ont/geosparql#hasGeometry> ?geometry."
                            +"?geometry <http://www.opengis.net/ont/geosparql#asWKT> ?wkt."
                            +"}"

                            +"ORDER BY DESC(?issued)"
                            +"LIMIT 1"
                        },
                        error: function (request, status, error) {
                            // FEHLERCODE 202
                            if (!errorOccured) {
                                errorOccured = true;
                                console.log(request.responseText)
                                alert("Ein Fehler ist aufgetreten. (Fehlercode 202) \nFalls dieses Problem weiterhin auftritt, " +
                                    "wenden Sie sich bitte and die Forschungsstelle Digitale Nachhaltigkeit")
                            }
                        }
                    }).then(function (data) {
                        debugger;
                       try {
                            data = data["results"]["bindings"][0]["wtk"]["value"];
                            debugger;
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

        if (this.businessType === null) {
            $.ajax({
                url: "http://lindas-data.ch/sparql/",
                headers: {
                    Accept: "application/sparql-results+json"
                },
                dataType: "json",
                data: {
                    query: "SELECT DISTINCT * FROM <https://linked.opendata.swiss/graph/FSVO/outbreak> WHERE "
                    +"{"+obj.URI+" <http://blv.ch/cat> ?o}"
                },

                error: function (request, status, error) {
                    // FEHLERCODE 203
                    if (!errorOccured) {
                        errorOccured = true;
                        console.log(request.responseText)
                        alert("Ein Fehler ist aufgetreten. (Fehlercode 203) \nFalls dieses Problem weiterhin auftritt, " +
                            "wenden Sie sich bitte and die Forschungsstelle Digitale Nachhaltigkeit")
                    }
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
            if (value === 0)
                return "Schlachthof";
            else if (value === 1)
                return "Viehmarkt";
            else if (value === 2)
                return "Tierhaltung";
            else
                return "Alpung";
        }
    };

    this.getCanton = function(callback) {
        var obj = this;

        if (obj.canton === null) {
            $.ajax({
                url: "https://lindas-data.ch/sparql",
                headers: {
                    Accept: "application/sparql-results+json"
                },
                dataType: "json",
                data: {
                    query: "PREFIX gont: <https://gont.ch/> " +
                            "select ?canton where {" +
                            obj.municipality + " gont:municipalityVersion ?version." +
                                    "minus { ?version gont:abolitionEvent ?e}" +
                                "?version gont:canton ?canton."+
                            "}"
                }
            }).then(function (data) {
                try {
                    data = data["results"]["bindings"][0]["canton"]["value"];
                    obj.canton = parseCanton(data);
                } catch (err) {
                    console.log("no canton found");
                    obj.businessType = "missing_canton";
                }

            });

            function parseCanton(data) {
                var a = data.indexOf("canton/") + 7;
                return data.substring(a);
            }

        } else {
            callback(this.businessType);
        }
    }
}
