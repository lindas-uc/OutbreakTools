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
