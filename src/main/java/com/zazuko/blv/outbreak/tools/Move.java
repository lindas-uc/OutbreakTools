/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.zazuko.blv.outbreak.tools;

import java.util.Date;
import org.apache.clerezza.commons.rdf.IRI;

/**
 *
 * @author user
 */
public class Move {
    public final IRI from, to;
    public final Date date;
    public final IRI id;

    public Move(IRI id, IRI from, IRI to, Date date) {
        if ((id == null) || (from == null) || (to == null) || (date == null)) {
            throw new IllegalArgumentException("No argument may be null");
        }
        this.id = id;
        this.from = from;
        this.to = to;
        this.date = date;
    }
    
    
}
