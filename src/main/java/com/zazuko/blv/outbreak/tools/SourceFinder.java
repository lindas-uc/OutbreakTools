package com.zazuko.blv.outbreak.tools;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.clerezza.commons.rdf.IRI;

/**
 * Given a set of infected sites SourceFinder  finds potential sources
 * of the outbreak by finding single sites from which all infected sites could
 * have been infected.
 * 
 */
public class SourceFinder {
    
    final static int interval = 24*60*60*1000;
    final Tracer tracer = new Tracer(false);
    
    public Set<IRI> getPotentialSinglePointsOfOrigin(Set<IRI> infectedSites, 
            Date diagnosisDate, Date evaluateTill) throws IOException {
        if (infectedSites.size() < 2) {
            throw new IllegalArgumentException("Must specify at leat 2 infeted sites");
        }
        final List<Set<IRI>> ancestorSets = new ArrayList<>();
        for (IRI infectedSite : infectedSites) {
            ancestorSets.add(Collections.singleton(infectedSite));
        }
        final Set<IRI> result = new HashSet<>();
        Date evaluationDate = diagnosisDate;
        while (!evaluateTill .after(evaluationDate)) {
            evaluationDate = expandAncestorSets(ancestorSets, evaluationDate);
            final Set<IRI> intersection = getIntersection(ancestorSets);
            result.addAll(intersection);
            for (Set<IRI> ancestorSet : ancestorSets) {
                ancestorSet.removeAll(intersection);
            }
        }
        return result;
    }


    private Date expandAncestorSets(List<Set<IRI>> ancestorSets, Date date) throws IOException {
        final Date previousInterval = new Date(date.getTime() - interval);
        for (int i = 0; i < ancestorSets.size(); i++) {
            final Set<IRI> expandedSet = tracer.getPotentiallyInfectedSites(ancestorSets.get(i), date, previousInterval);
            ancestorSets.set(i, expandedSet);
        }
        return previousInterval;
    }

    private Set<IRI> getIntersection(List<Set<IRI>> ancestorSets) {
        final Set<IRI> candidates = new HashSet<>();
        candidates.addAll(ancestorSets.get(0));
        for (int i = 1; i < ancestorSets.size(); i++) {
            candidates.retainAll(ancestorSets.get(0));
        }
        return candidates;
    }
    
    
        
    
    public static void main(String... args) throws Exception {
        final Date diagnosisdate = Tracer.dateFormat.parse("2012-02-1");
        final Date evaluateTill = Tracer.dateFormat.parse("2012-01-01");
        final Set<IRI> infectedSites = new HashSet<>();
        infectedSites.add(new IRI("http://foodsafety.data.admin.ch/business/50543"));
        infectedSites.add(new IRI("http://foodsafety.data.admin.ch/business/51947"));
        infectedSites.add(new IRI("http://foodsafety.data.admin.ch/business/51116"));
        final SourceFinder tracer = new SourceFinder();
        final Set<IRI> result = tracer.getPotentialSinglePointsOfOrigin(infectedSites,
                diagnosisdate,
                evaluateTill);
        System.out.println(result.size()+" sites are potential points of origin");
        result.stream().forEach((iri) -> {
            System.out.println("IRI: "+iri);
        });
    }
}
