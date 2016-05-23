var javaConnector;
javaConnector = {

    startJavaApplication: function ($scope, callback) {
        var startDate = moment($scope.startDate, 'DD/MM/YYYY').toDate();
        startDate = moment(startDate).format("YYYY-MM-DD");

        var endDate = moment($scope.endDate, 'DD/MM/YYYY').toDate();
        endDate = moment(endDate).format("YYYY-MM-DD");

        console.log($scope.startBusiness[0].URI);
        var businessString = "";
        for (var i = 0; i < $scope.startBusiness.length; i++) {
            businessString += "startingSite="+$scope.startBusiness[i].URI+"&";
        }
        console.log(businessString);

        $(function() {
            var store = new LdpStore();
            var matchersTtl = $("#matchers").text();
            N3Parser.parse(matchersTtl, null, window.location.toString()).then(function (matchers) {
                store.match(
                    null,
                    null,
                    null,
                    "/trace?"+businessString+"startDate="+startDate+"&endDate=" + endDate,
                    function (error, data) {
                        callback(data);
                        var rendered = new RDF2h(matchers).render(data, rdf.createNamedNode(municipalityURI));
                        //$("#result").html(rendered);
                    });
            });
        });
    }        
};
