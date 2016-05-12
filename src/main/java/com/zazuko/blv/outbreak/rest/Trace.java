package com.zazuko.blv.outbreak.rest;

import com.zazuko.blv.outbreak.tools.ContactTracer;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.clerezza.commons.rdf.IRI;
 
@Path("trace")
public class Trace {
    
    final static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
 
    
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("")
    public byte[] trace(@QueryParam("startingSite") IRI startingSite) throws ParseException, IOException {
        if (startingSite == null) {
            throw new WebApplicationException("must specify startingSite", Response.Status.BAD_REQUEST);
        }
        final Date startDate = dateFormat.parse("2012-01-01");
        final Date endDate = dateFormat.parse("2012-02-01");
        //final IRI startingSite = new IRI("http://foodsafety.data.admin.ch/business/51122");
        final ContactTracer tracer = new ContactTracer();
        final Set<IRI> result = tracer.getPotentiallyInfectedSites(startingSite, 
                startDate,
                endDate);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter out = new PrintWriter(baos);
        out.println(result.size()+" sites have potentially been infected");
        if (!tracer.allowMultipleHopsInInterval) {
            out.println("WARNING: not taking into account multiple hops per time interval.");
        }
        result.stream().forEach((iri) -> {
            out.println("IRI: "+iri);
        });
        out.flush();
        return baos.toByteArray();
    }
   
    
}