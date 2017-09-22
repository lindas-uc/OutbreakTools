/**
 * Created by endtner on 10.08.2016.
 */

function loadAllBusinessPoints($scope, callback) {
    if ($scope.allBusinessPoints.length === 0) {
        $.ajax({
            url: "https://ld.geo.admin.ch/query/",
            dataType: "json",
            data: {
                query: "SELECT ?geomuni ?wkt \n" +
                "WHERE {\n" +
                "?geomuni a <http://schema.org/AdministrativeArea> .\n" +
                "?geomuni <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.geonames.org/ontology#A.ADM3>.\n" +
                "?geomuni <http://purl.org/dc/terms/hasVersion> ?geomuniVersion .\n" +
                "?geomuniVersion <http://purl.org/dc/terms/issued> ?issued.\n" +
                "?geomuniVersion <http://www.opengis.net/ont/geosparql#hasGeometry> ?geometry.\n" +
                "?geometry <http://www.opengis.net/ont/geosparql#asWKT> ?wkt.\n" +
                "}\n" +
                "ORDER BY DESC(?issued)\n"
            }
        }).then(function (data) {
            try {
                console.log(data);
                debugger;
                for (var i = 0; i < data.results.bindings.length; i++) {
                    $scope.allBusinessPoints.push({
                        uri: data.results.bindings[i].m.value,
                        pointX: parsePointX(data.results.bindings[i].wtk.value),
                        pointY: parsePointY(data.results.bindings[i].wtk.value)
                    });
                }
            } catch (err) {
                console.log("Something went wrong while loading all business points");
            }

            function parsePointX(sp) {
                sp = sp.substring(sp.search("POINT") + 8, sp.length - 2);
                sp = sp.split(" ");
                return parseInt(sp[0]);
            }

            function parsePointY(sp) {
                sp = sp.substring(sp.search("POINT") + 8, sp.length - 2);
                sp = sp.split(" ");
                return parseInt(sp[1]);
            }

            callback();
        });
    } else
        callback();
}