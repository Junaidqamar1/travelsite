// Your existing code here

function globalSearch() {
    const searchTerm = document.getElementById('autocomplete').value.toLowerCase();

    // Check the custom database first
    const customPlaces = customDatabase[searchTerm];
    if (customPlaces) {
        displayCustomPlaces(customPlaces);
    }

    // Then proceed with the Google Places API search
    searchGooglePlaces(searchTerm);
}

// Your existing functions here (initMap, initAutocomplete, fetchNearbyPlaces, displayPlaces, displayGlobalPlaces, etc.)

function displayCustomPlaces(results) {
    const placesList = document.getElementById('places-list');

    results.forEach(city => {
        city.places.forEach(place => {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(latitude, longitude),
                new google.maps.LatLng(place.latitude, place.longitude)
            ) / 1000; // Distance in kilometers

            const listItem = document.createElement('div');
            listItem.innerHTML = `
                <div class="container">
                    <div class="info">
                        <h3>${place.name}</h3>
                        <p>${place.description}</p>
                        <p>Distance: ${distance.toFixed(2)} km</p>
                    </div>
                </div>
            `;

            placesList.appendChild(listItem);

            // Add a marker for each custom place on the map
            const marker = new google.maps.Marker({
                position: { lat: place.latitude, lng: place.longitude },
                map: map,
                title: place.name
            });
        });
    });
}

// Your customDatabase definition here
