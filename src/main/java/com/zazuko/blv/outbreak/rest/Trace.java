package com.zazuko.blv.outbreak.rest;

import com.zazuko.blv.outbreak.tools.ContactTracer;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import org.apache.clerezza.commons.rdf.Graph;
import org.apache.clerezza.commons.rdf.IRI;
import org.apache.clerezza.commons.rdf.impl.utils.TripleImpl;
import org.apache.clerezza.commons.rdf.impl.utils.simple.SimpleGraph;
 
@Path("trace")
public class Trace {
    
    final static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
 
    
    @GET
    public Graph trace(@QueryParam("startingSite") IRI startingSite,
            @QueryParam("startDate") String startDateString,
            @QueryParam("endDate") String endDateString) throws ParseException, IOException {
        if (startingSite == null) {
            throw new WebApplicationException("must specify startingSite", Response.Status.BAD_REQUEST);
        }
        if (startDateString == null) {
            throw new WebApplicationException("must specify startDate", Response.Status.BAD_REQUEST);
        }
        if (endDateString == null) {
            throw new WebApplicationException("must specify endDate", Response.Status.BAD_REQUEST);
        }
        final Date startDate = dateFormat.parse(startDateString);
        final Date endDate = dateFormat.parse(endDateString);
        //final IRI startingSite = new IRI("http://foodsafety.data.admin.ch/business/51122");
        final ContactTracer tracer = new ContactTracer();
        final Set<IRI> resultSet = tracer.getPotentiallyInfectedSites(startingSite, 
                startDate,
                endDate);
        final Graph result = new SimpleGraph();
        resultSet.stream().forEach((iri) -> {
            result.add(new TripleImpl(startingSite, 
                new IRI("http://blv.admin.ch/hasPathTo"), 
                iri));
        });
        
        return result;
    }
    
    
}