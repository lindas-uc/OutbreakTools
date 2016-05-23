package com.zazuko.blv.outbreak.tools;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.clerezza.commons.rdf.IRI;
import org.apache.clerezza.commons.rdf.RDFTerm;

/**
 *
 * Traces contacts by interval expansion. Th expansion of the set of potentiallyInfected 
 * entities is computed for every interval after an outbreak date.
 * 
 * Note that while this class support backward tracing the methods are appropriately
 * named for forward tracing.
 */
public class ContactTracer {
    
    /**
     * If true a site potentiallyInfected by a site potentially infected for the first 
     * time within the same interval will count as potentially infected.
     */
    final public boolean allowMultipleHopsInInterval = true;
    final static int interval = 24*60*60*1000;
    final SparqlClient sparqlClient = new SparqlClient("http://test.lindas-data.ch/sparql");
    final static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    final boolean forward;
    
    /**
     * Creates a forward tracer
     */
    public ContactTracer() {
        this.forward = true;
    }
    
    /**
     * Creates a forward (towards potentially infected site) or backward tracer 
     * (towards potentially infecting sites)
     * @param forward true to trace forward, false for backward
     */
    public ContactTracer(boolean forward) {
        this.forward = forward;
    }
    
    public Set<Move> getPotentiallyInfectedSites(IRI startingSite, Date startingDate, Date evaluationDate) throws IOException {
        final Set<IRI> potentiallyInfectedSites = new HashSet();
        potentiallyInfectedSites.add(startingSite);
        return getPotentiallyInfectedSites(potentiallyInfectedSites, startingDate, evaluationDate);
    }
    
    public Set<Move> getPotentiallyInfectedSites(Set<IRI> startingSites, Date startingDate, Date evaluationDate) throws IOException {
        //even the most aggressive germ can't travel back in time
        if (forward && evaluationDate.before(startingDate)) {
            return Collections.emptySet();
        }
        if (!forward && startingDate.before(evaluationDate)) {
            return Collections.emptySet();
        }
        final Set<IRI> potentiallyInfectedSites = new HashSet();
        potentiallyInfectedSites.addAll(startingSites);
        final Set<Move> result = getContactsInInterval(startingSites, startingDate);
        potentiallyInfectedSites.addAll(result.stream().map(m -> m.to).collect(Collectors.toSet()));
        final Date nextInterval = forward ? new Date(startingDate.getTime()+interval)
                : new Date(startingDate.getTime()-interval);
        result.addAll(getPotentiallyInfectedSites(potentiallyInfectedSites, nextInterval, evaluationDate));
        return result;
    }
    
    /**
     * Returns a Set containing sites potentially infected during interval starting at `date`
     */
    private Set<Move> getContactsInInterval(Set<IRI> startingSites, Date date) throws IOException {
        return getContactsInInterval(startingSites, date, new HashSet<>());
    }
    
    /**
     * expands staringSites if they are not in alreadyExpanded
     */
    private Set<Move> getContactsInInterval(Set<IRI> startingSites, Date date, Set<IRI> alreadyExpanded) throws IOException {
        final Set<Move> result = new HashSet<>();
        for (IRI site : startingSites) {
            if (alreadyExpanded.add(site)) {
                result.addAll(getContactsInInterval(site, date));
            }
        }
        if (allowMultipleHopsInInterval && result.size() > 0) {
            Set<IRI> recurseSite = result.stream()
                .map(elt -> elt.to)
                .collect(Collectors.toSet()); 
            result.addAll(getContactsInInterval(recurseSite, date, alreadyExpanded));
        }
        return result;
    }

    private Set<Move> getContactsInInterval(IRI startingSite, Date date) throws IOException {
        //TODO use interval rather than date
        final String query = forward ? 
                "PREFIX blv: <http://blv.ch/>\n"
                + "PREFIX schema:     <http://schema.org/>\n"
                + "PREFIX dct:     <http://purl.org/dc/elements/1.1/>\n"
                + "PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>\n"
                + "SELECT DISTINCT ?M ?T FROM <http://test.lindas-data.ch/resource/animaltransports> "
                + "WHERE { "
                        + "   ?M schema:fromLocation <"+startingSite.getUnicodeString()+"> ."
                        + "   ?M schema:toLocation ?T."
                        + "   ?M dct:date \""+dateFormat.format(date)+"\"^^xsd:date."
                        + "}"
                : "PREFIX blv: <http://blv.ch/>\n"
                + "PREFIX schema:     <http://schema.org/>\n"
                + "PREFIX dct:     <http://purl.org/dc/elements/1.1/>\n"
                + "PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>\n"
                + "SELECT DISTINCT ?T FROM <http://test.lindas-data.ch/resource/animaltransports> "
                + "WHERE { "
                        + "   ?M schema:toLocation<"+startingSite.getUnicodeString()+"> ."
                        + "   ?M schema:fromLocation ?T."
                        + "   ?M dct:date \""+dateFormat.format(date)+"\"^^xsd:date."
                        + "}";
        final List<Map<String, RDFTerm>> queryResults = sparqlClient.queryResultSet(query);
        final Set<Move> result = new HashSet<>();
        for (Map<String, RDFTerm> queryResult : queryResults) {
            result.add(new Move((IRI) queryResult.get("M"), startingSite, (IRI) queryResult.get("T"), date));
        }
        return result;
    }
    
    public static void main(String... args) throws Exception {
        final Date startDate = dateFormat.parse("2012-01-01");
        final Date endDate = dateFormat.parse("2012-02-01");
        final IRI startingSite = new IRI("http://foodsafety.data.admin.ch/business/51122");
        final ContactTracer tracer = new ContactTracer();
        Set<Move> moves = tracer.getPotentiallyInfectedSites(startingSite, 
                startDate,
                endDate);
        final Set<IRI> sites = moves.stream().map(m -> m.to).collect(Collectors.toSet());
        System.out.println(sites.size()+" sites have potentially been infected");
        if (!tracer.allowMultipleHopsInInterval) {
            System.out.println("WARNING: not taking into account multiple hops per time interval.");
        }
        sites.stream().forEach((iri) -> {
            System.out.println("IRI: "+iri);
        });
    }
    
}
