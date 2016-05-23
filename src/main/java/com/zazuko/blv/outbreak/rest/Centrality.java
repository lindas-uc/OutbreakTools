package com.zazuko.blv.outbreak.rest;

import com.zazuko.blv.outbreak.tools.CentralPredecessorFinder;
import com.zazuko.blv.outbreak.tools.ContactTracer;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import org.apache.clerezza.commons.rdf.Graph;
import org.apache.clerezza.commons.rdf.IRI;
import org.apache.clerezza.commons.rdf.impl.utils.TripleImpl;
import org.apache.clerezza.commons.rdf.impl.utils.TypedLiteralImpl;
import org.apache.clerezza.commons.rdf.impl.utils.simple.SimpleGraph;
import org.apache.clerezza.rdf.ontologies.DCTERMS;
 
@Path("centrality")
public class Centrality {
    
    final static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
 
    
    
    
    @GET
    @Path("debug")
    public String debug() throws ParseException, IOException {
        final Set<IRI> startingSite = new HashSet<>();
        startingSite.add(new IRI("http://foodsafety.data.admin.ch/business/50543"));
        final Date startingDate = dateFormat.parse("2012-02-01");
        final Date evaluationDate = dateFormat.parse("2012-01-22");
        CentralPredecessorFinder finder = new CentralPredecessorFinder();
        return finder.debug(startingSite, startingDate, evaluationDate);
    }
    
    
}