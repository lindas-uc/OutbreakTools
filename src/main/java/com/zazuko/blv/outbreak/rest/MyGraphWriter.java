package com.zazuko.blv.outbreak.rest;

import org.apache.clerezza.jaxrs.rdf.providers.GraphWriter;
import org.apache.clerezza.rdf.core.serializedform.Serializer;

/**
 *
 * @author user
 */
public class MyGraphWriter extends GraphWriter {

    public MyGraphWriter() {
        bindSerializer(Serializer.getInstance());
    }
    
}
