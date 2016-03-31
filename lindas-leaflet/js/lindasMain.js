var app = angular.module('lindasMain', []);

app.service('validator', function() {
    //returns false if date invalid
    this.validateDate = function(date) {
        var now = new Date();
        var valDate = moment(date, "DD/MM/YYYY").toDate();
        if (valDate == "Invalid Date")
            return false;
        if ((now.getDate() - valDate.getDate()) <= 0) {
            return false;
        } else {
            return true;
        }
    }

    this.validateTieIds = function(id) {
        if (id > 0) {
            return true;
        } else {
            return false;
        }
    }
});

app.service('sparql', function() {

    var sparqlQuery = {
        endpoint: "http://test.lindas-data.ch/sparql",
        prefixBlv: "<http://blv.ch/>",
        tieIds: [],
        prefixXsd: "<http://www.w3.org/2001/XMLSchema#>",
        from: "<http://test.lindas-data.ch/resource/animaltransports>",
        sparql: "PREFIX blv: <http://blv.ch/>PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>SELECT DISTINCT ?T ?D FROM <http://test.lindas-data.ch/resource/animaltransports>WHERE {?M blv:fromFarm <http://foodsafety.data.admin.ch/business/51122>.?M blv:toFarm ?T.?M blv:date ?D.}"
    }

    this.executeSparql = function () {
        function exec() {
            /* Uncomment to see debug information in console */
            d3sparql.debug = true
            d3sparql.query(sparqlQuery.endpoint, sparqlQuery.sparql, render)
        }
        function render(json) {
            return json;
            /* set options and call the d3spraql.xxxxx function in this library ... */
            /*var config = {
             "selector": "#result"
             }
             d3sparql.htmltable(json, config);
             console.log(d3sparql.htmltable(json, config));*/
        }

        console.log("start execution");
        exec();
    }

    this.addTieIds = function(idsList) {
        sparqlQuery.tieIds.push(idsList);
        console.log(sparqlQuery.tieIds);
    }
});

app.service('map', function() {


    this.initializeMap = function(start, end, $scope) {

        //initial value for filter
        $scope.filterStartDateMilliseconds = start;
        $scope.filterEndDateMilliseconds = end;

        //draw leafletMap
        $scope.leafletMap = L.map('map').setView([47.00, 8.00], 8);
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18,
            }).addTo($scope.leafletMap);

        /* Initialize the SVG layer */
        $scope.leafletMap._initPathRoot();

        /* We simply pick up the SVG from the map object */
        var svg = d3.select("#map").select("svg"),
            g3 = svg.append("g"),
            g2 = svg.append("g"),
            g = svg.append("g");

        var markerHeight = 13;
        var markerWidth = 13;

        //add defs für marker-end to svg element
        var marker = svg.append("defs").append("marker");
        marker.attr("id","markerArrow")
            .attr("markerWidth",markerWidth)
            .attr("markerHeight",markerHeight)
            .attr("refX",2)
            .attr("refY",6)
            .attr("orient","auto");

        marker.append("path")
            .attr("d","M2,2 L2,11 L10,6 L2,2");

        //initialize tooltip
        //DO THIS FOR CONNECTIONS AND FROMFARM TO
        tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10,0])
            .html(function(d) {
                return "Name: " + d.B_Name + "<br>Date: " + moment(d.Date).format('DD.MM.YYYY') + "<br>weitere Attribute";
            });

        //parse testdata
        d3.csv("testdata/testdata2.csv", function(data) {
            /* Add a LatLng object to each item in the dataset */
            data.forEach(function(d) {
                d.A_LatLng = new L.LatLng(d.A_lat,
                    d.A_long);
                d.B_LatLng = new L.LatLng(d.B_lat,
                    d.B_long);
                d.Date = moment(d.Date.substring(0,10), "YYYY-MM-DDTZD").toDate();
            });

            $scope.originalData = data;

            data = $scope.originalData.filter(function(d) {
                var date = d.Date.getTime();
                return (date > $scope.filterStartDateMilliseconds && date < $scope.filterEndDateMilliseconds);
            });

            var r = 15;
            var markerMargin = 5;

            var circlesToFarm = g.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", r)
                .attr("class","circleToFarm")
                .on("mouseenter", function(d) {
                    tip.show(d);
                    d3.select(this).classed({'tmpCircle':true, 'circleToFarm':true});
                })
                .on("mouseleave", function(d) {
                    d3.select(this).classed({'tmpCircle':false, 'circleToFarm':true});
                    tip.hide(d);
                });

            var circlesFromFarm = g2.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", r)
                .attr("class","circleFromFarm");

            var arrows = g3.selectAll("line")
                .data(data)
                .enter()
                .append("line")
                .attr("class", "connection")
                .attr("marker-end","url(#markerArrow)");

            $scope.leafletMap.on("viewreset", resize);

            /* Invoke the tip in the context of your visualization */
            circlesToFarm.call(tip);

            resize();

            function resize() {
                circlesToFarm.attr("cx", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).x;
                    })
                    .attr("cy", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).y;
                    });

                circlesFromFarm.attr("cx", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.A_LatLng).x;
                    })
                    .attr("cy", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.A_LatLng).y;
                    });

                arrows.attr("x1", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.A_LatLng).x;
                    })
                    .attr("y1", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.A_LatLng).y;
                    })
                    .attr("x2", function(d) {
                        return newXPositionAtCircleRadius($scope.leafletMap.latLngToLayerPoint(d.A_LatLng).x,
                            $scope.leafletMap.latLngToLayerPoint(d.A_LatLng).y,
                            $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).x,
                            $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).y,
                            (r + markerHeight + markerMargin));
                    })
                    .attr("y2", function(d) {
                        return newYPositionAtCircleRadius($scope.leafletMap.latLngToLayerPoint(d.A_LatLng).x,
                            $scope.leafletMap.latLngToLayerPoint(d.A_LatLng).y,
                            $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).x,
                            $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).y,
                            (r + markerHeight + markerMargin));
                    })

            }

            //update circles with start- and enddate
            function update(start, end) {

                //filter Data with start- and enddate.
                data = $scope.originalData.filter(function(d) {
                    var date = d.Date.getTime();
                    return (date > start && date < end);
                })

                circlesToFarm = g.selectAll(".circleToFarm")
                    .data(data);

                circlesToFarm.enter()
                    .append("circle")
                    .attr("r", r)
                    .attr("class","circleToFarm")
                    .attr("cx", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).x;
                    })
                    .attr("cy", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).y;
                    })
                    .on("mouseenter", function(d) {
                        tip.show(d);
                        d3.select(this).classed({'tmpCircle':true, 'circleToFarm':true});
                    })
                    .on("mouseleave", function(d) {
                        d3.select(this).classed({'tmpCircle':false, 'circleToFarm':true});
                        tip.hide(d);
                    });

                circlesToFarm.exit().remove();

                circlesFromFarm = g2.selectAll(".circleFromFarm")
                    .data(data);

                circlesFromFarm.enter()
                    .append("circle")
                    .attr("r", r)
                    .attr("class","circleFromFarm")
                    .attr("cx", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).x;
                    })
                    .attr("cy", function(d) {
                        return $scope.leafletMap.latLngToLayerPoint(d.B_LatLng).y;
                    });

                circlesFromFarm.exit().remove();

                arrows = g3.selectAll(".connection")
                    .data(data);

                arrows.enter()
                    .append("line")
                    .attr("class", "connection")
                    .attr("marker-end","url(#markerArrow)");

                arrows.exit().remove();

                resize();

            }

            function newXPositionAtCircleRadius(x1,y1,cx,cy,r) {
                var theta =  Math.atan2(y1-cy , x1-cx);
                return (cx + r * Math.cos(theta));
            }

            function newYPositionAtCircleRadius(x1,y1,cx,cy,r) {
                var theta =  Math.atan2(y1-cy , x1-cx);
                return (cy + r * Math.sin(theta));
            }

            //draw slider
            var slider = d3.slider()
                .axis(true)
                .min($scope.startDateMilliseconds).max($scope.endDateMilliseconds).step(5)
                .value( [$scope.startDateMilliseconds, $scope.endDateMilliseconds ] )
                .on("slide", function(evt, value) {
                    $scope.filterStartDateMilliseconds = value[0];
                    $scope.filterEndDateMilliseconds = value[1];
                    update($scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds);
                });

            d3.select('#slider').call(slider);

            //override Dates with date format
            var ticks = $("#slider .tick");
            for (var i = 0; i < ticks.length; i++){
                var date = new Date(parseInt($(ticks[i]).text()));
                var stringDate = moment(date).format("DD.MM.YYYY");
                $(ticks[i]).find("text").text(stringDate);
            }

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
                })
                $scope.filterStartDateMilliseconds = $scope.startDateMilliseconds;
                //start a new animation if already selected whole date range
                if ($scope.filterEndDateMilliseconds == $scope.endDateMilliseconds)
                    $scope.filterEndDateMilliseconds = $scope.startDateMilliseconds + WEEK_IN_MILLISECONDS;
                interval = setInterval(function() {
                    //animation week by week
                    if ($scope.endDateMilliseconds - WEEK_IN_MILLISECONDS < $scope.filterEndDateMilliseconds) {
                        update($scope.startDateMilliseconds, $scope.endDateMilliseconds);
                        $scope.filterEndDateMilliseconds = $scope.endDateMilliseconds
                        drawSlider([$scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds]);
                        //break interval
                        clearInterval(interval);
                        $scope.animationRunning = false;
                        $scope.$apply();
                    } else {
                        $scope.filterEndDateMilliseconds = $scope.filterEndDateMilliseconds + WEEK_IN_MILLISECONDS;
                        update($scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds);
                        drawSlider([$scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds]);
                    }
                },300);
            })

            //REMOVE THIS IF POSSIBLE!!
            function drawSlider(values) {
                $("#slider").empty();

                //draw slider
                var slider = d3.slider()
                    .axis(true)
                    .min($scope.startDateMilliseconds).max($scope.endDateMilliseconds).step(5)
                    .value( values )
                    .on("slide", function(evt, value) {
                            $scope.filterStartDateMilliseconds = value[0];
                            $scope.filterEndDateMilliseconds = value[1];
                            update($scope.filterStartDateMilliseconds, $scope.filterEndDateMilliseconds);
                        });

                        d3.select('#slider').call(slider);

                        //override Dates with date format
                        var ticks = $("#slider .tick");
                        for (var i = 0; i < ticks.length; i++){
                            var date = new Date(parseInt($(ticks[i]).text()));
                            var stringDate = moment(date).format("DD.MM.YYYY");
                            $(ticks[i]).find("text").text(stringDate);
                        }
            }

            //UNTIL HERE

        })
    }
});

