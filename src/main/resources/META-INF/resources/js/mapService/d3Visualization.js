var d3Vis;
var maper;

d3Vis = {

    slider: null,
    data: null,
    bounds: null,
    map: null,
    svg: null,
    g: null,
    g2: null,
    g3: null,
    g4: null,

    //set markers
    marker: null,
    markerHeight: 13,
    markerWidth: 13,
    markerMargin: 5,
    refX: 2,
    refY: 6,

    //set circle radius
    r: 15,

    //elements
    circlesToFarm: null,
    circlesFromFarm: null,
    pathsToFarm: null,
    arrows: null,
    $scope: null,

    //initialize tooltips
    //DO THIS FOR CONNECTIONS AND FROMFARM TO
    tip_to_location: d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Name: " + d.toBusiness.name + "<br>Date: " + moment(d.date).format('DD.MM.YYYY') + "<br>Betriebsart: "+d.toBusiness.businessType +"<br>weitere Attribute";
        }),

    tip_from_location: d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Name: " + d.toBusiness.name + "<br>Date: " + moment(d.date).format('DD.MM.YYYY') + "<br>Betriebsart: "+d.fromBusiness.businessType +"<br>weitere Attribute";
        }),

    tip_connections: d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "From: " + d.fromBusiness.name + "<br>To: " + d.toBusiness.name + "<br>Date: " + moment(d.date).format('DD.MM.YYYY') + "<br>weitere Attribute";
        }),


    drawVisualization: function (overlay, bounds, $scope, map) {
        this.$scope = $scope;
        d3Vis.data = $scope.data;
        d3Vis.bounds = bounds;
        d3Vis.$scope = $scope;
        d3Vis.map = map;
        maper = map;

        // Add the container when the overlay is added to the map.
        //get the vector layer div element
        var div = d3.selectAll("#" + overlay.div.id);
        //remove the existing svg element and create a new one
        div.selectAll("svg").remove();
        d3Vis.svg = div.append("svg");
        //Add a G (group) element
        d3Vis.g4 = d3Vis.svg.append("g"),
            d3Vis.g3 = d3Vis.svg.append("g"),
            d3Vis.g2 = d3Vis.svg.append("g"),
            d3Vis.g = d3Vis.svg.append("g");

        //add defs for marker-end to svg element
        d3Vis.marker = d3Vis.svg.append("defs").append("marker");
        d3Vis.marker.attr("id", "markerArrow")
            .attr("markerWidth", d3Vis.markerWidth)
            .attr("markerHeight", d3Vis.markerHeight)
            .attr("refX", d3Vis.refX)
            .attr("refY", d3Vis.refY)
            .attr("orient", "auto");


        d3Vis.map.events.register("moveend", d3Vis.map, function() {
            d3Vis.reset();
          //  olMap.addEdgeBar();
        });

        d3Vis.update($scope);

    },

    //update circles with start- and enddate
    update: function ($scope) {

        d3Vis.marker.select("path").remove();

        if ($scope.individualArrowWidth) {
            d3Vis.marker.append("path")
                .attr("d", "M2,2 L2,8 L6,6 L2,4");
        } else {
            d3Vis.marker.append("path")
                .attr("d", "M2,2 L2,11 L10,6 L2,2");
        }

        var tip_from_location = d3Vis.tip_from_location;
        var tip_to_location = d3Vis.tip_to_location;
        var tip_connections = d3Vis.tip_connections;

        //filter Data with start- and enddate in scope
        data = $scope.data;

        var fillMin = d3.min(data, function(d) {return d.value});
        var fillMax = d3.max(data, function(d) {return d.value});

        var fillScale = function(value) {
            return "red";
            var col = 255 - Math.round((value-fillMin)/(fillMax-fillMin)*255);
            return "rgb("+col+","+col+","+col+")";
        };

        var numberAnimalsMin = d3.min(data, function(d) {return d.numberAnimals});
        var numberAnimalsMax = d3.max(data, function(d) {return d.numberAnimals});

        var lineWidthScale = d3.scale.linear()
            .domain([numberAnimalsMin,numberAnimalsMax])
            .range([1.5,5]);

        var circleDataToFarm = data.filter(function(d) {
            return circleFilter(d.toBusiness);
        });

        var pathDataToFarm = data.filter(function(d) {
            return !(circleFilter(d.toBusiness));
        });

        var circleDataFromFarm = data.filter(function(d) {
            return circleFilter(d.fromBusiness);
        });

        var pathDataFromFarm = data.filter(function(d) {
            return !(circleFilter(d.fromBusiness));
        });

        function circleFilter(business) {
            return business.businessType.localeCompare("Viehmarkt") == 0 || $scope.showDifferentForms == false;
        }

        //remove all paths. Change maybe if performance is bad
        d3Vis.g.selectAll("path").remove();
        d3Vis.g2.selectAll("path").remove();

        d3Vis.circlesToFarm = d3Vis.g.selectAll(".circleToFarm")
            .data(circleDataToFarm);

        d3Vis.pathsToFarm = d3Vis.g.selectAll(".pathToFarm")
            .data(pathDataToFarm);

        d3Vis.circlesToFarm.enter()
            .append("circle")
            .attr("class", "circleToFarm")
            //.attr("fill", function(d) {return fillScale(d.value)})
            .attr("r", d3Vis.r)
            .on("mouseenter", function (d) {
                tip_to_location.show(d);
            })
            .on("mouseleave", function (d) {
                tip_to_location.hide(d);
            });

        d3Vis.pathsToFarm.enter()
            .append("path")
            .attr("class", "pathToFarm")
            //.attr("fill", function(d) {return fillScale(d.value)})
            .on("mouseenter", function (d) {
                tip_connections.show(d);
            })
            .on("mouseleave", function (d) {
                tip_connections.hide(d);
            });

        d3Vis.circlesToFarm.exit().remove();
        d3Vis.pathsToFarm.exit().remove();

        d3Vis.circlesFromFarm = d3Vis.g2.selectAll(".circleFromFarm")
            .data(circleDataFromFarm);

        d3Vis.pathsFromFarm = d3Vis.g2.selectAll(".pathToFarm")
            .data(pathDataFromFarm);

        d3Vis.circlesFromFarm.enter()
            .append("circle")
            .attr("r", d3Vis.r)
            .attr("class", "circleFromFarm")
            .on("mouseenter", function (d) {
                tip_from_location.show(d);
            })
            .on("mouseleave", function (d) {
                tip_from_location.hide(d);
            });
           // .attr("fill", function(d) {return fillScale(d.value)});

        d3Vis.pathsFromFarm.enter()
            .append("path")
            .attr("class", "path");
          //  .attr("fill", function(d) {return fillScale(d.value)});

        d3Vis.circlesFromFarm.exit().remove();
        d3Vis.pathsFromFarm.exit().remove();

        d3Vis.arrows = d3Vis.g3.selectAll(".connection")
            .data(data);

        d3Vis.arrows.enter()
            .append("line")
            .attr("stroke-width", function(d) {
                if ($scope.individualArrowWidth)
                    return lineWidthScale(d.numberAnimals);
                else
                    return 2;
            })
            .attr("class", "connection")
            .attr("marker-end", "url(#markerArrow)")
            .on("mouseenter", function (d) {
                //tip_connections.show(d);
            })
            .on("mouseleave", function (d) {
               // tip_connections.hide(d);
            });

        d3Vis.arrows
            .transition()
            .attr("stroke-width", function(d) {
                if ($scope.individualArrowWidth)
                    return lineWidthScale(d.numberAnimals);
                else
                    return 2;
        });

        d3Vis.arrows.exit().remove();

        /* Invoke the tip in the context of your visualization */

        try {
            d3Vis.arrows.call(d3Vis.tip_to_location);
        } catch (err) {
            //do nothing. nothing bad went wrong
        }
        try {
            d3Vis.arrows.call(d3Vis.tip_from_location);
        } catch (err) {
            //do nothing. nothing bad went wrong
        }
        try {
            //d3Vis.arrows.call(d3Vis.tip_connections);
        } catch (err) {
            //do nothing. nothing bad went wrong
        }

       // d3Vis.arrows.call(d3Vis.tip_connections);

        d3Vis.reset();

    },

    reset: function() {

        var r = d3Vis.r;
        var markerHeight = d3Vis.markerHeight;
        var markerMargin = d3Vis.markerMargin;
        var map = d3Vis.map;
        var bounds = d3Vis.bounds;

        var bottomLeft = project(bounds.bottom, bounds.left),
            topRight = project(bounds.top, bounds.right);

        /*
        d3.json("js/mapService/boundaries2.json",function(collection) {
            path = d3.geo.path().projection(project2);

            //bounds2 = d3.geo.bounds(collection)

            console.log(collection.geometries);
            var feature = d3Vis.g4.selectAll("path")
                .data(collection.geometries)
                .enter().append("path");
            d3Vis.g4.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
            feature.attr("d",path)
                .attr("class","boundaries");
        });
        */


        //place svg element
        d3Vis.svg.attr("width", topRight[0] - bottomLeft[0])
            .attr("height", bottomLeft[1] - topRight[1])
            .style("margin-left", bottomLeft[0] + "px")
            .style("margin-top", topRight[1] + "px");

        //place g element
        d3Vis.g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
        d3Vis.g2.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
        d3Vis.g3.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
        d3Vis.g4.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");


        d3Vis.pathsToFarm.attr("d", function (d) {
            if (d.toBusiness.businessType.localeCompare("Schlachthof") == 0)
                return calculateTrianglePath(d.toBusiness);
            else if (d.toBusiness.businessType.localeCompare("Alpung") == 0)
                return calculateRectanglePath(d.toBusiness);
            else if (d.toBusiness.businessType.localeCompare("Tierhaltung") == 0)
                return calculateRectangleRotatedPath(d.toBusiness);
        });


        d3Vis.circlesToFarm.attr("cx", function (d) {
                return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0]
            })
            .attr("cy", function (d) {
                return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1]
            });

        d3Vis.circlesToFarm.transition().attr("r", d3Vis.r);

        d3Vis.pathsFromFarm.attr("d", function (d) {
            if (d.fromBusiness.businessType.localeCompare("Schlachthof") == 0)
                return calculateTrianglePath(d.fromBusiness);
            else if (d.fromBusiness.businessType.localeCompare("Alpung") == 0)
                return calculateRectanglePath(d.fromBusiness);
            else if (d.fromBusiness.businessType.localeCompare("Tierhaltung") == 0)
                return calculateRectangleRotatedPath(d.fromBusiness);
            });

        d3Vis.circlesFromFarm.attr("cx", function (d) {
                return project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[0]
            })
            .attr("cy", function (d) {
                return project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[1]
            });

        d3Vis.arrows.attr("x1", function (d) {
                return project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[0]
            })
            .attr("y1", function (d) {
                return project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[1]
            })
            .attr("x2", function (d) {
                return newXPositionAtCircleRadius(project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[0],
                    project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[1],
                    project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0],
                    project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1],
                    (r + markerHeight + markerMargin));
            })
            .attr("y2", function (d) {
                return newYPositionAtCircleRadius(project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[0],
                    project(d.fromBusiness.coordinates[0], d.fromBusiness.coordinates[1])[1],
                    project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0],
                    project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1],
                    (r + markerHeight + markerMargin));
            });

        /* DRAW PROTECTION ZONE */

        if (d3Vis.calculateIfMonitoringZoneNeeded()) {

            var rMon = Math.round(d3Vis.calculateTenKmInPixel() / 2);

            var monitoringZones = d3Vis.g4.selectAll(".monitoringZone")
                .data(data);

            monitoringZones.enter()
                .append("circle")
                .attr("class", "monitoringZone")
                .attr("cx", function (d) {
                    return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0]
                })
                .attr("cy", function (d) {
                    return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1]
                })
                .attr("r", rMon);

            monitoringZones.attr("cx", function (d) {
                return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0]
            })
                .attr("cy", function (d) {
                    return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1]
                })
                .attr("r", rMon);

            monitoringZones.exit().remove();

            if (d3Vis.calculateIfProtectionZoneNeeded()) {
                var rProt = Math.round((rMon * 3 / 10) / 2);

                var protectionZones = d3Vis.g4.selectAll(".protectionZone")
                    .data(data);

                protectionZones.enter()
                    .append("circle")
                    .attr("class", "protectionZone")
                    .attr("cx", function (d) {
                        return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0]
                    })
                    .attr("cy", function (d) {
                        return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1]
                    })
                    .attr("r", rProt);

                protectionZones.attr("cx", function (d) {
                    return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[0]
                })
                    .attr("cy", function (d) {
                        return project(d.toBusiness.coordinates[0], d.toBusiness.coordinates[1])[1]
                    })
                    .attr("r", rProt);

                protectionZones.exit().remove();

            } else {
                d3.selectAll(".protectionZone").remove();
            }
        } else {
            d3.selectAll(".monitoringZone").remove();
            d3.selectAll(".protectionZone").remove();
        }

        /*HELPER METHODS*/

        function project(x, y) {
            var point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(x, y));
            return [point.x, point.y];
        }

        function newXPositionAtCircleRadius(x1, y1, cx, cy, r) {
            var theta = Math.atan2(y1 - cy, x1 - cx);
            return (cx + r * Math.cos(theta));
        }

        function newYPositionAtCircleRadius(x1, y1, cx, cy, r) {
            var theta = Math.atan2(y1 - cy, x1 - cx);
            return (cy + r * Math.sin(theta));
        }

        function project2(x) {
            var point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(x[0], x[1]));
            if (point.x < 0)
                console.log(x[0] + " " + point.x);
            return [point.x, point.y];
        }

        function calculateTrianglePath(d) {
            //a = length of triangle side
            var a = 30;
            var h = Math.round(Math.sqrt(a*a/2));
            var x = project(d.coordinates[0], d.coordinates[1])[0];
            var y = project(d.coordinates[0], d.coordinates[1])[1];

            var path = "M"+(x-a/2)+" "+(y+h/2)+" L"+(x+a/2)+" "+(y+h/2)+" L"+x+" "+(y-h/2)+" Z";
            return path;
        }

        function calculateRectanglePath(d) {
            var a = 20;
            var x = project(d.coordinates[0], d.coordinates[1])[0];
            var y = project(d.coordinates[0], d.coordinates[1])[1];

            var path = "M"+(x-a/2)+" "+(y+a/2)+" L"+(x+a/2)+" "+(y+a/2)+" L"+(x+a/2)+" "+(y-a/2)+" L"+(x-a/2)+" "+(y-a/2) +" Z";
            return path;
        }

        function calculateRectangleRotatedPath(d) {
            var a = 30;
            var x = project(d.coordinates[0], d.coordinates[1])[0];
            var y = project(d.coordinates[0], d.coordinates[1])[1];

            var path = "M"+x+" "+(y+a/2)+" L"+(x+a/2)+" "+y+" L"+x+" "+(y-a/2)+" L"+(x-a/2)+" "+y +" Z";
            return path;
        }

    },

    calculateIfProtectionZoneNeeded: function() {

        var tenKmInPixelThreshold = 102;

        if (tenKmInPixelThreshold < d3Vis.calculateTenKmInPixel() && this.$scope.showProtectionZone)
            return true;
        else
            return false;
    },

    calculateIfMonitoringZoneNeeded: function() {

        var tenKmInPixelThreshold = 30;

        if (tenKmInPixelThreshold < d3Vis.calculateTenKmInPixel() && this.$scope.showMonitoringZone)
            return true;
        else
            return false;
    },

    calculateTenKmInPixel: function() {
        var element = $("#lindasMainContainer");
        var $scope = angular.element(element).scope();

        var a = [parseInt($scope.data[0].fromBusiness.coordinates[0]), parseInt($scope.data[0].fromBusiness.coordinates[1])];
        var b = [a[0] + 10000, a[1]];

        var pointA = d3Vis.map.getViewPortPxFromLonLat(new OpenLayers.LonLat(a));
        var pointB = d3Vis.map.getViewPortPxFromLonLat(new OpenLayers.LonLat(b));

        var difference = pointB.x - pointA.x;

        return difference;
    },


    drawSlider: function(values, $scope) {

        //draw slider
        d3Vis.slider = d3.slider()
            .axis(true)
            .min($scope.startDateMilliseconds).max($scope.endDateMilliseconds).step(5)
            .value(values)
            .on("slide", function (evt, value) {
                $scope.$apply(function() {
                    $scope.filterStartDateMilliseconds = value[0];
                    $scope.filterEndDateMilliseconds = value[1];
                });
            });

        d3.select('#slider').call(d3Vis.slider);

        //override Dates with date format
        var ticks = $("#slider .tick");
        for (var i = 0; i < ticks.length; i++) {
            var date = new Date(parseInt($(ticks[i]).text()));
            var stringDate = moment(date).format("DD.MM.YYYY");
            $(ticks[i]).find("text").text(stringDate);
        }
    },

    setAnimation: function($scope) {

        //set animation
        //WORKING. Change override of slider. Make WEEK_IN_MILLISECONDS generic!
        var interval;
        var WEEK_IN_MILLISECONDS = 86400000 * 7;
        d3.select("#startAnimation").on("click", function() {

            //stop animation if it's already running
            if($scope.animationRunning == true) {
                clearInterval(interval);
                $scope.animationRunning = false;
                $scope.$apply();
                return null;
            }

            $scope.$apply(function() {
                $scope.animationRunning = true;
                $scope.filterStartDateMilliseconds = $scope.startDateMilliseconds;
                //start a new animation if already selected whole date range
                if ($scope.filterEndDateMilliseconds == $scope.endDateMilliseconds)
                    $scope.filterEndDateMilliseconds = $scope.startDateMilliseconds + WEEK_IN_MILLISECONDS;
            });
            interval = setInterval(function() {
                //animation week by week
                //angular calls the update() after changing milliseconds
                if ($scope.endDateMilliseconds - WEEK_IN_MILLISECONDS < $scope.filterEndDateMilliseconds) {
                    $scope.filterEndDateMilliseconds = $scope.endDateMilliseconds;
                    d3Vis.drawSlider([$scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds]);
                    //break interval
                    clearInterval(interval);
                    $scope.animationRunning = false;
                    $scope.$apply();
                } else {
                    $scope.$apply(function() {
                        $scope.filterEndDateMilliseconds = $scope.filterEndDateMilliseconds + WEEK_IN_MILLISECONDS;
                    });
                    $("#slider").empty();
                    d3Vis.drawSlider([$scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds],$scope);
                }
            },300);
        });

    }
};