var app = angular.module('lindasMain', []);

app.service('sparql', function() {

    var sparqlQuery = {
        endpoint: "http://test.lindas-data.ch/sparql",
        prefixBlv: "<http://blv.ch/>",
        prefixXsd: "<http://www.w3.org/2001/XMLSchema#>",
        from: "<http://test.lindas-data.ch/resource/animaltransports>",

        sparql: "PREFIX blv: <http://blv.ch/>PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>SELECT DISTINCT ?T ?D FROM <http://test.lindas-data.ch/resource/animaltransports>WHERE {?M blv:fromFarm <http://foodsafety.data.admin.ch/business/51122>.?M blv:toFarm ?T.?M blv:date ?D.}"
    }

    this.executeSparql = function () {
        function exec() {
            /* Uncomment to see debug information in console */
            d3sparql.debug = true
            d3sparql.query(sparqlQuery.endpoint, sparqlQuery.sparql, render)
        }
        function render(json) {
            return json;
            /* set options and call the d3spraql.xxxxx function in this library ... */
            /*var config = {
             "selector": "#result"
             }
             d3sparql.htmltable(json, config);
             console.log(d3sparql.htmltable(json, config));*/
        }

        console.log("start execution");
        exec();
    }

    this.setEndpoint = function(endpoint) {
        sparqlQuery.endpoint = endpoint;
    }

    this.setSparql = function(sparql) {
        sparqlQuery.sparql = sparql;
    }
});

app.service('validator', function() {
    this.validateDate = function(date) {
        var now = new Date();
        var valDate = moment(date, "DD/MM/YYYY").toDate();
        console.log((now.getDate() - valDate.getDate()));
        if ((now.getDate() - moment(date, "DD/MM/YYYY")) <= 0) {
            return true;
        } else {
            return false;
        }
    }
});
