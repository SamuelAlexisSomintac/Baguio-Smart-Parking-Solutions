// --- Initialize the Map ---
var map = L.map('map').setView([51.505, -0.09], 13); // Default view

// --- Add Tile Layer ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- Geolocation Feature ---
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
                `);
        });
    })
    .catch((error) => {
        console.error("Error fetching parking data: ", error.message);
        alert("Unable to load parking data.");
    });

// --- Marker Clustering ---
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
map.addLayer(markers); // Add cluster group to the map
