
////////////////////////////////////////////////////////



//get Size of map
var mapSize = $scope.map.getSize();

//extent: coordinates of map box. [west,south, east, north]
var extent = $scope.map.getView().calculateExtent(mapSize);
//console.log(extent);

//draw svg element
var svg = d3.select("#map .ol-overlaycontainer").append("svg").call(d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoom)),
    g3 = svg.append("g"),
    g2 = svg.append("g"),
    g = svg.append("g");

function zoom() {

    console.log(d3.event.translate);
    console.log(d3.event.scale);
    var translate = "translate(" + (d3.event.translate) + ")scale(" + (d3.event.scale*1.1) + ")";
    g3.attr("transform", translate);
    g2.attr("transform", translate);
    g.attr("transform", translate);

}

//position svg element
svg.attr("width", mapSize[0])
    .attr("height", mapSize[1])
    .style("position","relative")
    .style("bottom", mapSize[1]);

//define size of Markers
var markerHeight = 13;
var markerWidth = 13;
var r = 15;
var markerMargin = 5;

//add defs for marker-end to svg element
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
d3.csv("testdata/testdata3.csv", function(data) {
    /* Add a LatLng object to each item in the dataset */
    data.forEach(function(d) {
        d.Date = moment(d.Date.substring(0,10), "YYYY-MM-DDTZD").toDate();
    });

    $scope.originalData = data;

    data = $scope.originalData.filter(function(d) {
        var date = d.Date.getTime();
        //delete
        return (date > $scope.filterStartDateMilliseconds && date < $scope.filterEndDateMilliseconds);
    });

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

    //$scope.map.on("viewreset", resize);

    /* Invoke the tip in the context of your visualization */
    circlesToFarm.call(tip);

    $scope.map.on('moveend', resize);
    //$scope.map.on('resize', hideSVG);

    resize();

    $('#map').on('mousedown mouseup', function mouseState(e) {
        if (e.type == "mousedown") {
            //code triggers on hold
            //hideSVG();
        }
    });

    function hideSVG() {
        $("#map svg").hide();
    }

    function resize() {
        //remove transform and translate of g elements
        g.attr("transform",null);
        g2.attr("transform",null);
        g3.attr("transform",null);

        $("#map svg").show();
        extent = $scope.map.getView().calculateExtent(mapSize);

        circlesToFarm.attr("cx", function(d) {
                return getXViewPointFromCoordinates(d.B_lon);
            })
            .attr("cy", function(d) {
                return getYViewPointFromCoordinates(d.B_lat);
            });


        circlesFromFarm.attr("cx", function(d) {
                return getXViewPointFromCoordinates(d.A_lon);
            })
            .attr("cy", function(d) {
                return getYViewPointFromCoordinates(d.A_lat);
            });

        arrows.attr("x1", function(d) {
                return getXViewPointFromCoordinates(d.A_lon);
            })
            .attr("y1", function(d) {
                return getYViewPointFromCoordinates(d.A_lat);
            })
            .attr("x2", function(d) {
                return newXPositionAtCircleRadius(
                    getXViewPointFromCoordinates(d.A_lon),
                    getYViewPointFromCoordinates(d.A_lat),
                    getXViewPointFromCoordinates(d.B_lon),
                    getYViewPointFromCoordinates(d.B_lat),
                    (r + markerHeight + markerMargin));
            })
            .attr("y2", function(d) {
                return newYPositionAtCircleRadius(
                    getXViewPointFromCoordinates(d.A_lon),
                    getYViewPointFromCoordinates(d.A_lat),
                    getXViewPointFromCoordinates(d.B_lon),
                    getYViewPointFromCoordinates(d.B_lat),
                    (r + markerHeight + markerMargin));
            })
    }

    //update circles with start- and enddate
    function update(start, end) {

        //filter Data with start- and enddate.
        data = $scope.originalData.filter(function(d) {
            var date = d.Date.getTime();
            return (date > start && date < end);
        });

        circlesToFarm = g.selectAll(".circleToFarm")
            .data(data);

        circlesToFarm.enter()
            .append("circle")
            .attr("r", r)
            .attr("class","circleToFarm")
            .attr("cx", function(d) {
                return getXViewPointFromCoordinates(d.B_lon);
            })
            .attr("cy", function(d) {
                return getYViewPointFromCoordinates(d.B_lat);
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
                return getXViewPointFromCoordinates(d.A_lon);
            })
            .attr("cy", function(d) {
                return getYViewPointFromCoordinates(d.A_lat);
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

    //return points in svg element, which represents given coordinates on map
    //x coordinate
    function getXViewPointFromCoordinates(lon) {
        if (lon <= 0)
            console.log("Invalid coordinates: " + lon);
        var x = mapSize[0]/(extent[2]-extent[0])*(lon-extent[0]);
        return x;
    }

    //return points in svg element, which represents given coordinates on map
    //y coordinate
    function getYViewPointFromCoordinates(lat) {
        if (lat <= 0)
            console.log("Invalid coordinates: " + lat);
        var y = mapSize[1] - mapSize[1]/(extent[3]-extent[1])*(lat-extent[1]);
        return y;
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

