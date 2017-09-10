app.service('sparql', function() {

    var sparqlQuery = {
        endpoint: "https://lindas-data.ch/sparql",
        prefixBlv: "<http://blv.ch/>",
        tieIds: [],
        prefixXsd: "<http://www.w3.org/2001/XMLSchema#>",
        from: "<https://linked.opendata.swiss/graph/FSVO/outbreak>",
        sparql: "PREFIX blv: <http://blv.ch/>PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>SELECT DISTINCT ?T ?D FROM <https://linked.opendata.swiss/graph/FSVO/outbreak> WHERE {?M blv:fromFarm <http://foodsafety.data.admin.ch/business/51122>.?M blv:toFarm ?T.?M blv:date ?D.}"
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

    this.addTieIds = function(idsList) {
        sparqlQuery.tieIds.push(idsList);
        console.log(sparqlQuery.tieIds);
    }
});