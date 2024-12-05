// --- Initialize the Map ---
var map = L.map('map').setView([51.505, -0.09], 13); // Default view

// --- Add Tile Layer ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- Geolocation Feature ---
// Center the map on the user's location if supported
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            map.setView([userLat, userLon], 15); // Center map on user's location
            L.marker([userLat, userLon])
                .addTo(map)
                .bindPopup("You are here.")
                .openPopup(); // Add a marker for the user's location
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
// Fetch parking data from an API and display markers
const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL for testing

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
                `); // Display dynamic data in popups
        });
    })
    .catch((error) => {
        console.error("Error fetching parking data: ", error.message);
        alert("Unable to load parking data.");
    });

// --- Clickable Map Interaction ---
// Allow users to add markers dynamically by clicking on the map
map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const locationName = prompt("Enter a name for this location:");
    if (locationName) {
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${locationName}</b>`); // Add user-defined markers
    }
});

// --- Marker Clustering ---
// Cluster parking location markers for better performance
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
    markers.addLayer(marker); // Add marker to clustering group
});
map.addLayer(markers); // Add cluster group to the map
