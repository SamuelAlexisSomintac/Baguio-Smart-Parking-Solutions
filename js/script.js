// --- Geolocation Feature ---
// Place this code at the top to center the map on the user's location if supported.
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            map.setView([userLat, userLon], 15);
            L.marker([userLat, userLon])
                .addTo(map)
                .bindPopup("You are here.")
                .openPopup();
        },
        function (error) {
            console.error("Geolocation error: ", error.message);
            alert("Unable to retrieve your location. Showing default view.");
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}

// --- Dynamic Parking Data ---
// Add this code below the geolocation feature.
const apiUrl = "https://example.com/api/parking-data"; // Replace with your API URL
fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch parking data.");
        }
        return response.json();
    })
    .then((data) => {
        data.forEach((location) => {
            L.marker([location.lat, location.lon])
                .addTo(map)
                .bindPopup(`
                    <b>${location.name}</b><br>
                    Available Spaces: ${location.availableSpaces}<br>
                    Total Spaces: ${location.totalSpaces}
                `);
        });
    })
    .catch((error) => {
        console.error("Error fetching parking data: ", error.message);
        alert("Unable to load parking data.");
    });

// --- Clickable Map Interaction ---
// Place this code to allow users to add markers dynamically by clicking the map.
map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const locationName = prompt("Enter a name for this location:");
    if (locationName) {
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${locationName}</b>`);
    }
});

// --- Marker Clustering ---
// Place this code last to ensure all markers are handled efficiently.
const markers = L.markerClusterGroup();
const parkingLocations = [
    { lat: 16.4023, lon: 120.5960, name: "Igorot Stone Kingdom" },
    { lat: 16.4112, lon: 120.6000, name: "Baguio Botanical Garden" },
    { lat: 16.4125, lon: 120.5856, name: "Mines View Park" },
];
parkingLocations.forEach((location) => {
    const marker = L.marker([location.lat, location.lon]).bindPopup(
        `<b>${location.name}</b>`
    );
    markers.addLayer(marker);
});
map.addLayer(markers);
