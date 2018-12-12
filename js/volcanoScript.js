var volcanomap;

        //the function is called upon page open/refresh
        function initMap() {
            volcanomap = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: new google.maps.LatLng(28.9, 2.4), // Center Map.
                mapTypeId: 'terrain' // can be any valid type
            });
        }

        $(document).ready(function () {

            $('#volcano-button').click(function () {
//                 Set Google map  to its start state
                volcanomap = new google.maps.Map(document.getElementById('map'), {
                    zoom: 2,
                    center: new google.maps.LatLng(28.9, 2.4), // Center Map.
                    mapTypeId: 'terrain' // can be any valid type
                });

                // The following uses JQuery library
                $.ajax({
                    // The URL of the specific data required
                    url: "https://cors-anywhere.herokuapp.com/https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes&maxFeatures=100&outputFormat=application/json",

                    // Called if there is a problem loading the data
                    error: function () {
                        $('#info').html('<p>An error has occurred</p>');
                    },
                    // Called when the data has succesfully loaded
                    success: function (data) {
                        i = 0;
                        var pointers = []; // keep an array of Google Maps markers, to be used by the Google Maps clusterer
                        $.each(data.features, function (key, val) {
                            // Get the lat and lng data for use in the markers
                            var values = val.geometry.coordinates;
                            var latLng = new google.maps.LatLng(values[1], values[0]);
                            // Now create a new marker on the map
                            var label = new google.maps.Marker({
                                position: latLng,
                                volcanomap: volcanomap
                            });
                            pointers[i++] = label; // Add the marker to array to be used by clusterer

                            //markers show info windows upon click activity with this code
                             label.addListener('click', function (data) {
                                infowindow.open(volcanomap, label); // Open the Google maps marker infoWindow
                            });
                            
                            // Form a string that holds desired marker infoWindow content. The infoWindow will pop up when you click on a marker on the map
                            var infowindow = new google.maps.InfoWindow({
                                content: "<h6>" + val.properties.Volcano_Name + " is a/an " +val.properties.Primary_Volcano_Type+" volcano in " +val.properties.Country+ "</h6><p>"+val.properties.Geological_Summary+"</p><p><a href='" + val.properties.Primary_Photo_Link + "' target='_blank'>see it's image here</a></p>"
                            });
                            
                        });
                        var markerCluster = new MarkerClusterer(volcanomap, pointers,
                            { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
                    }
                });
            });
        });