$(function() {
    var center = new google.maps.LatLng(34.702315, 135.495551);
    var mapOptions = {
        zoom:17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center
    };
    
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    var directionPathLocationsService = new DirectionPathLocationsService(map);
    var placeService = new google.maps.places.PlacesService(map);
    var markers = new PlaceMarkers();
    
    search();
    
    $('#search').on('click', function() {
        search();
    });
    
    function search(waypoint) {
        markers.clear();
        
        var form = new SearchForm();
        
        try {
            form.verify();
        } catch (e) {
            alert(e);
            return false;
        }
        
        var parameter = form.get();
        
        var request = {
            origin: parameter.from,
            destination: parameter.to
        };
        
        if (waypoint) {
            request.waypoints = [waypoint];
        }
        
        directionPathLocationsService.search(request, function(location) {
            
            placeService.search({
                location: location,
                radius: 100,
                keyword: parameter.keyword
            }, function(results, status) {
                console.log(status);
                _.each(results, function(result) {
                    markers.add({
                        position: result.geometry.location,
                        map: map,
                        title: result.name,
                        onClick: function() {
                            search({
                                location: result.geometry.location,
                                stopover: true
                            });
                        }
                    });
                })
            });
        });
    }
    
    function SearchForm() {
        var _from,
            _to,
            _keyword;
        
        function load() {
            _from = $('#from').val();
            _to = $('#to').val();
            _keyword = $('#keyword').val();
        }
        
        this.verify = function() {
            load();
            
            if (!_from || !_to || !_keyword) {
                throw '未入力の項目があります';
            }
        };
        
        this.get = function() {
            load();
            return {
                from: _from,
                to: _to,
                keyword: _keyword
            };
        };
    }
    
    function DirectionPathLocationsService(map) {
        var _directionService = new google.maps.DirectionsService();
        var _directionsDisplay = new google.maps.DirectionsRenderer();
        _directionsDisplay.setMap(map);
        
        this.search = function(request, callback) {
            request.travelMode = google.maps.TravelMode.DRIVING;
            
            _directionService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    _directionsDisplay.setDirections(result);
                    
                    var pathLocations = new PathLocations();
                    
                    eachPathPoint(result, function(latlng) {
                        pathLocations.add(latlng);
                    });
                    
                    pathLocations.each(callback);
                }
            });
        };
    }
    
    function PathLocations() {
        var _locations = [];
        
        this.add = function(location) {
            _locations.push(location);
        };
        
        this.each = function(callback) {
            var cnt = 0;
            _.each(_locations, function(location) {
                if (cnt % 10 === 0) {
                    callback(location);
                }
                
                cnt++;
            })
        };
    }
    
    function eachPathPoint(result, callback) {
        _.each(result.routes, function(route) {
            _.each(route.legs, function(leg) {
                _.each(leg.steps, function(step) {
                    _.each(step.path, function(latlng) {
                        callback(latlng);
                    })
                });
            });
        });
    }
    
    function PlaceMarkers() {
        var _markers = [];
        
        this.add = function(opt) {
            var marker = new google.maps.Marker(opt);
            
            google.maps.event.addListener(marker, 'click', function() {
                opt.onClick();
            });
            
            _markers.push(marker);
        };
        
        this.clear = function() {
            _.each(_markers, function(marker) {
                marker.setMap(null);
            });
            _markers = [];
        };
    }
});
