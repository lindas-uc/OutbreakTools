package com.zazuko.blv.outbreak.tools;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
    final boolean allowMultipleHopsInInterval = true;
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
    
    public Set<IRI> getPotentiallyInfectedSites(IRI startingSite, Date startingDate, Date evaluationDate) throws IOException {
        final Set<IRI> potentiallyInfectedSites = new HashSet();
        potentiallyInfectedSites.add(startingSite);
        return getPotentiallyInfectedSites(potentiallyInfectedSites, startingDate, evaluationDate);
    }
    
    public Set<IRI> getPotentiallyInfectedSites(Set<IRI> startingSites, Date startingDate, Date evaluationDate) throws IOException {
        //even the most aggressive germ can't travel back in time
        if (forward && evaluationDate.before(startingDate)) {
            return startingSites;
        }
        if (!forward && startingDate.before(evaluationDate)) {
            return startingSites;
        }
        final Set<IRI> potentiallyInfectedSites = new HashSet();
        potentiallyInfectedSites.addAll(startingSites);
        final Set<IRI> firstContactRound = getContactsInInterval(startingSites, startingDate);
        potentiallyInfectedSites.addAll(firstContactRound);
        final Date nextInterval = forward ? new Date(startingDate.getTime()+interval)
                : new Date(startingDate.getTime()-interval);
        potentiallyInfectedSites.addAll(getPotentiallyInfectedSites(potentiallyInfectedSites, nextInterval, evaluationDate));
        return potentiallyInfectedSites;
    }
    
    /**
     * Returns a Set containing sites potentially infected during interval starting at `date`
     */
    private Set<IRI> getContactsInInterval(Set<IRI> startingSites, Date date) throws IOException {
        return getContactsInInterval(startingSites, date, new HashSet<>());
    }
    
    /**
     * expands staringSites if they are not in alreadyExpanded
     */
    private Set<IRI> getContactsInInterval(Set<IRI> startingSites, Date date, Set<IRI> alreadyExpanded) throws IOException {
        final Set<IRI> result = new HashSet<>();
        for (IRI site : startingSites) {
            if (alreadyExpanded.add(site)) {
                result.addAll(getContactsInInterval(site, date));
            }
        }
        if (allowMultipleHopsInInterval && result.size() > 0) {
            result.addAll(getContactsInInterval(result, date, alreadyExpanded));
        }
        return result;
    }

    private Set<IRI> getContactsInInterval(IRI startingSite, Date date) throws IOException {
        //TODO use interval rather than date
        final String query = forward ? 
                "PREFIX blv: <http://blv.ch/>\n"
                + "PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>\n"
                + "SELECT DISTINCT ?T FROM <http://test.lindas-data.ch/resource/animaltransports> "
                + "WHERE { "
                        + "   ?M blv:fromFarm <"+startingSite.getUnicodeString()+"> ."
                        + "   ?M blv:toFarm ?T."
                        + "   ?M blv:date \""+dateFormat.format(date)+"\"^^xsd:date."
                        + "}"
                : "PREFIX blv: <http://blv.ch/>\n"
                + "PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>\n"
                + "SELECT DISTINCT ?T FROM <http://test.lindas-data.ch/resource/animaltransports> "
                + "WHERE { "
                        + "   ?M blv:toFarm <"+startingSite.getUnicodeString()+"> ."
                        + "   ?M blv:fromFarm ?T."
                        + "   ?M blv:date \""+dateFormat.format(date)+"\"^^xsd:date."
                        + "}";
        final List<Map<String, RDFTerm>> queryResults = sparqlClient.queryResultSet(query);
        final Set<IRI> result = new HashSet<>();
        for (Map<String, RDFTerm> queryResult : queryResults) {
            result.add((IRI) queryResult.get("T"));
        }
        return result;
    }
    
    public static void main(String... args) throws Exception {
        final Date startDate = dateFormat.parse("2012-01-01");
        final Date endDate = dateFormat.parse("2012-02-01");
        final IRI startingSite = new IRI("http://foodsafety.data.admin.ch/business/51122");
        final ContactTracer tracer = new ContactTracer();
        final Set<IRI> result = tracer.getPotentiallyInfectedSites(startingSite, 
                startDate,
                endDate);
        System.out.println(result.size()+" sites have potentially been infected");
        if (!tracer.allowMultipleHopsInInterval) {
            System.out.println("WARNING: not taking into account multiple hops per time interval.");
        }
        result.stream().forEach((iri) -> {
            System.out.println("IRI: "+iri);
        });
    }
    
}
