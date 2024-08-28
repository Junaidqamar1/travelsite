let map;
let latitude, longitude;
let autocomplete;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("Latitude:", latitude, "Longitude:", longitude);

            // Initialize the map and autocomplete after getting the location
            initMap();
            initAutocomplete();
        },
        function (error) {
            console.error("Error getting location:", error);
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

function initMap() {
    if (latitude !== undefined && longitude !== undefined) {
        const location = { lat: latitude, lng: longitude };

        // Create a map centered at the given location
        map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 14
        });

        // Call the function to fetch nearby places
        fetchNearbyPlaces(location);
    } else {
        console.error("Latitude and longitude are not defined.");
    }
}

function initAutocomplete() {
    const input = document.getElementById('autocomplete');
    autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            console.error("No details available for input: '" + place.name + "'");
            return;
        }

        // Center the map on the selected place
        map.setCenter(place.geometry.location);
        map.setZoom(14);

        // Fetch nearby places based on the selected location
        fetchNearbyPlaces(place.geometry.location);
    });
}

function fetchNearbyPlaces(location) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: location,
        radius: '1500',
        type: ['Restaurant'],
        keyword: 'Restaurant'
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayPlaces(results);
        } else {
            console.error('PlacesService was not successful for the following reason:', status);
        }
    });
}

function globalSearch() {
    const searchTerm = document.getElementById('autocomplete').value;
    const service = new google.maps.places.PlacesService(map);

    const request = {
        query: searchTerm,
        fields: ['name', 'geometry', 'photos', 'formatted_address'],
    };

    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayGlobalPlaces(results);
            map.setCenter(results[0].geometry.location);
        } else {
            console.error('PlacesService was not successful for the following reason:', status);
        }
    });
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const photoUrl = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) : 'https://via.placeholder.com/200';
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(latitude, longitude),
            place.geometry.location
        ) / 1000; // Distance in kilometers

        const listItem = document.createElement('div');
        listItem.innerHTML = `
            <div class="container">
                <div class="info">
                    <h3>${place.name}</h3>
                    <p>${place.vicinity}</p>
                    <p>Distance: ${distance.toFixed(2)} km</p>
                </div>
                <div class="img">
                    <img src="${photoUrl}" alt="${place.name}">
                </div>
            </div>
        `;

        placesList.appendChild(listItem);

        // Add a marker for each place on the map
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });
    });
}

function displayGlobalPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const photoUrl = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) : 'https://via.placeholder.com/200';
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(latitude, longitude),
            place.geometry.location
        ) / 1000;
        const listItem = document.createElement('div');
        listItem.innerHTML = `
            <div class="container">
                <div class="info">
                    <h3>${place.name}</h3>
                    <p>${place.formatted_address}</p>
                    <p>Distance: ${distance.toFixed(2)} km</p>
                </div>
                <div class="img">
                    <img src="${photoUrl}" alt="${place.name}">
                </div>
            </div>
        `;

        placesList.appendChild(listItem);

        // Add a marker for each place on the map
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });
    });
}
