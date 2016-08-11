/**
 * Created by endtner on 10.08.2016.
 */

function loadAllBusinessPoints($scope, callback) {
    if ($scope.allBusinessPoints.length == 0) {
        $.ajax({
            url: "http://lindas.zazuko.com/blazegraph/namespace/swisstopo/sparql",
            dataType: "json",
            data: {
                query: "SELECT ?wtk ?m WHERE { " +
                "?G <https:\/\/gont.ch\/municipality> ?m ." +
                "?G    <http:\/\/linkeddata.interlis.ch\/IlisMeta07.MetaElemOID\/swissBOUNDARIES3D_ili2_LV03_V1_3_ceis.TLM_GRENZEN.TLM_HOHEITSGEBIET.RefPoint> ?S." +
                "?S <http:\/\/www.opengis.net\/ont\/geosparql#asWKT> ?wtk" +
                "}"
            }
        }).then(function (data) {
            try {
                console.log(data);
                for (var i = 0; i < data.results.bindings.length; i++) {
                    $scope.allBusinessPoints.push({
                        uri: data.results.bindings[i].m.value,
                        pointX: parsePointX(data.results.bindings[i].wtk.value),
                        pointY: parsePointY(data.results.bindings[i].wtk.value)
                    });
                }
            } catch (err) {
                console.log("Something went wrong at loading all business points");
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