package com.zazuko.blv.outbreak.rest;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



public class ResourceServingFilter implements Filter {

    public static final String RESOURCE_PREFIX = "/META-INF/resources";
    public static final int RESOURCE_PREFIX_LENGTH = RESOURCE_PREFIX.length();
    

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilterHttp((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    @Override
    public void destroy() {
    }



       
    private void doFilterHttp(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {        
        final String requestPath = request.getRequestURI();
        String contextPath = request.getContextPath();
        String resourcePath = requestPath.substring(contextPath.length());
        final InputStream is = ResourceServingFilter.class.getResourceAsStream(RESOURCE_PREFIX + resourcePath);
        if (is != null) {
            if (request.getMethod().equals("GET") || request.getMethod().equals("HEAD")) {
                String mediaType = URLConnection.guessContentTypeFromName(resourcePath);
                response.setContentType(mediaType);
                //TODO can we get the length of a resource without 
                //TODO handle caching related headers
                if (!request.getMethod().equals("HEAD")) {
                    OutputStream os = response.getOutputStream();
                    byte[] ba = new byte[1024];
                    int i = is.read(ba);
                    while (i != -1) {
                        os.write(ba, 0, i);
                        i = is.read(ba);
                    }
                    os.flush();
                } else {
                    is.close();
                }
            } else {
                //TODO handle OPTIONS
                response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            }
        } else {
            chain.doFilter(request, response);
        }
    }

  

}
