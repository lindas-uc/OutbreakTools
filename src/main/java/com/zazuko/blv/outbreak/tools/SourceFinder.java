package com.zazuko.blv.outbreak.tools;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.clerezza.commons.rdf.IRI;

/**
 * Given a set of infected sites SourceFinder  finds potential sources
 * of the outbreak by finding single sites from which all infected sites could
 * have been infected.
 * 
 */
public class SourceFinder {
    
    final static int interval = 24*60*60*1000;
    final ContactTracer tracer = new ContactTracer(false);
    
    public interface Report {
        Set<IRI> getPotentialSinglePointsOfOrigin();
        Set<Move> getAllMoves();
    }
    
    public Report findSources(final Set<IRI> infectedSites, 
            final Date diagnosisDate, final Date evaluateTill) throws IOException {
        if (infectedSites.size() < 2) {
            final ContactTracer ct = new ContactTracer(false);
            final Set<Move> allMoves = ct.getPotentiallyInfectedSites(infectedSites, diagnosisDate, evaluateTill);
            return new Report() {
                
                @Override
                public Set<IRI> getPotentialSinglePointsOfOrigin() {
                    return Collections.emptySet();
                }

                @Override
                public Set<Move> getAllMoves() {
                    return allMoves;
                }
            };
        }
        final List<Set<IRI>> ancestorSets = new ArrayList<>();
        for (IRI infectedSite : infectedSites) {
            ancestorSets.add(Collections.singleton(infectedSite));
        }
        final Set<Move> allMoves = new HashSet<>();
        final Set<IRI> result = new HashSet<>();
        Date evaluationDate = diagnosisDate;
        while (!evaluateTill .after(evaluationDate)) {
            evaluationDate = expandAncestorSets(ancestorSets, evaluationDate, allMoves);
            final Set<IRI> intersection = getIntersection(ancestorSets);
            result.addAll(intersection);
            for (Set<IRI> ancestorSet : ancestorSets) {
                ancestorSet.removeAll(intersection);
            }
        }
        return new Report() {
                
            @Override
            public Set<IRI> getPotentialSinglePointsOfOrigin() {
                return result;
            }

            @Override
            public Set<Move> getAllMoves() {
                return allMoves;
            }
        };
    }


    private Date expandAncestorSets(List<Set<IRI>> ancestorSets, Date date, Set<Move> allMoves) throws IOException {
        final Date previousInterval = new Date(date.getTime() - interval);
        for (int i = 0; i < ancestorSets.size(); i++) {
            final Set<Move> moves = tracer.getPotentiallyInfectedSites(ancestorSets.get(i), date, previousInterval);
            allMoves.addAll(moves);
            final Set<IRI> expandedSet = moves.stream().map(m -> m.from).collect(Collectors.toSet());
            expandedSet.addAll(ancestorSets.get(i));
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
        final Date diagnosisdate = ContactTracer.dateFormat.parse("2012-02-1");
        final Date evaluateTill = ContactTracer.dateFormat.parse("2012-01-01");
        final Set<IRI> infectedSites = new HashSet<>();
        infectedSites.add(new IRI("http://foodsafety.data.admin.ch/business/50543"));
        infectedSites.add(new IRI("http://foodsafety.data.admin.ch/business/51947"));
        infectedSites.add(new IRI("http://foodsafety.data.admin.ch/business/51116"));
        final SourceFinder tracer = new SourceFinder();
        final Set<IRI> result = tracer.findSources(infectedSites,
                diagnosisdate,
                evaluateTill).getPotentialSinglePointsOfOrigin();
        System.out.println(result.size()+" sites are potential points of origin");
        result.stream().forEach((iri) -> {
            System.out.println("IRI: "+iri);
        });
    }
}
