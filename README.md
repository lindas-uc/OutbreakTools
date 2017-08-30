# OutbreakTools

Tools to deal with an epidemiologic outbreak using the animal transport information
available via the Lindas SPARQL Endpoint.

The tool help answering the following questions:

* If an infections was established at a site at a certain date, which sites could
be infected at a latter point in time? (Contact Tracing)
* If a site is infected, where might the infection come from? (Reverse contact tracing)
* If multiple sites are infected what are single sites from which the infection 
could have been transmitted to all site with confirmed infection? (Source Finding) 

## Status

The code runs and shows that and how this kind of applications can be implemented
against the Lindas SPARQL Endpoint. The code is not yet optimized and lacks tests.
It must not be used productively there is no guarantee that the results are correct.

## Usage

There is currently only a partial HTTP API, also the classes `ContactTracer` and 
`SourceFinder`in the package `com.zazuko.blv.outbreak.tools` are executable. At 
the moment to provide the input data for the computation their Main methods
must be adapted.

The following is an example for the usage of the HTTP interface for contact tracing (forward tracing):

 * http://localhost:5000/trace?startingSite=http://foodsafety.data.admin.ch/business/51122&startDate=2012-01-01&endDate=2012-02-01

The following is to trace backwards and find central hot-spots:

 * http://localhost:5000/centrality?startingSite=http://foodsafety.data.admin.ch/business/5112&startingSite=http://foodsafety.data.admin.ch/business/51122&startDate=2012-02-01&endDate=2012-01-20


## Geo Data

The data in the animal transport graph references municipalities using IRIs like `<http://classifications.data.admin.ch/municipality/4551>`, the https://sparql.geo.admin.ch/ endpoint can be used to get the shape of such a municipality as wkt with a query like:

```
SELECT ?wkt WHERE {

?geomuni <http://www.w3.org/2000/01/rdf-schema#seeAlso> <http://classifications.data.admin.ch/municipality/4551>.
?geomuni <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.geonames.org/ontology#A.ADM3>.
?geomuni <http://purl.org/dc/terms/hasVersion> ?geomuniVersion .

?geomuniVersion <http://purl.org/dc/terms/issued> ?issued.
?geomuniVersion <http://www.opengis.net/ont/geosparql#hasGeometry> ?geometry.
?geometry <http://www.opengis.net/ont/geosparql#asWKT> ?wkt.
}

ORDER BY DESC(?issued)
LIMIT 1
```
