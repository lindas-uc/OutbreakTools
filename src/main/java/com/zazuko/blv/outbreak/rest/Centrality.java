package com.zazuko.blv.outbreak.rest;

import com.zazuko.blv.outbreak.tools.CentralPredecessorFinder;
import com.zazuko.blv.outbreak.tools.ContactTracer;
import com.zazuko.blv.outbreak.tools.Move;
import com.zazuko.blv.outbreak.tools.Ontology;
import com.zazuko.blv.outbreak.tools.SourceFinder;

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
import org.apache.clerezza.commons.rdf.BlankNode;
import org.apache.clerezza.commons.rdf.Graph;
import org.apache.clerezza.commons.rdf.IRI;
import org.apache.clerezza.commons.rdf.impl.utils.TripleImpl;
import org.apache.clerezza.commons.rdf.impl.utils.TypedLiteralImpl;
import org.apache.clerezza.commons.rdf.impl.utils.simple.SimpleGraph;
import org.apache.clerezza.rdf.core.LiteralFactory;
import org.apache.clerezza.rdf.ontologies.DCTERMS;
import org.apache.clerezza.rdf.ontologies.RDF;
import org.apache.clerezza.rdf.ontologies.XSD;
 
@Path("centrality")
public class Centrality {
    
    final static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
 
    @GET
    public Graph trace(@QueryParam("startingSite") Set<IRI> startingSites,
            @QueryParam("startDate") String startDateString,
            @QueryParam("endDate") String endDateString) throws ParseException, IOException {
        if ((startingSites == null) || startingSites.isEmpty()) {
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
        final SourceFinder tracer = new SourceFinder();
        SourceFinder.Report report = tracer.findSources(startingSites, 
                startDate,
                endDate);
        final Set<Move> moves = report.getAllMoves();
        final Graph result = new SimpleGraph();
        moves.stream().forEach((move) -> {
            result.add(new TripleImpl(move.id, 
                    DCTERMS.date, 
                    new TypedLiteralImpl(dateFormat.format(move.date), XSD.date)));
            result.add(new TripleImpl(move.id, 
                    Ontology.TO_LOCATION, 
                    move.to));
            result.add(new TripleImpl(move.id, 
                    Ontology.FROM_LOCATION, 
                    move.from));    
        });   
        report.getPotentialSinglePointsOfOrigin().forEach((site) -> {
            BlankNode centralityAssertion = new BlankNode();
            result.add(new TripleImpl(centralityAssertion, 
                    DCTERMS.subject, 
                    site));
            result.add(new TripleImpl(centralityAssertion, 
                    RDF.value, 
                    LiteralFactory.getInstance().createTypedLiteral(1.0)));
        });
        return result;
    }
    
    
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