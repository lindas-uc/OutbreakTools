/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.zazuko.blv.outbreak.tools;

import java.io.IOException;
import java.util.Date;
import java.util.Set;
import org.apache.clerezza.commons.rdf.IRI;

/**
 *
 * @author user
 */
public class CentralPredecessorFinder {
    public String debug(final Set<IRI> startingSites, 
            final Date startingDate,
            final Date evaluationDate) throws IOException {
        ContactTracer ct = new ContactTracer(false);
        Set<Move> predecessors = ct.getPotentiallyInfectedSites(startingSites, startingDate, evaluationDate);
        return predecessors.toString();
    }
}
