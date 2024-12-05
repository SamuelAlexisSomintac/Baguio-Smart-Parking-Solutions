// Map Initialization
var map = L.map('map').setView([16.4023, 120.5960], 15); // Baguio City center

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Leaflet Routing Machine
var control = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    lineOptions: {
        styles: [{ color: 'red', weight: 4 }],
    },
}).addTo(map);

// Mock parking data
const parkingData = [
    { name: "Igorot Stone Kingdom", lat: 16.4023, lon: 120.5960, availableSpaces: 10 },
    { name: "Burnham Park", lat: 16.4028, lon: 120.5953, availableSpaces: 5 },
    { name: "Mines View Park", lat: 16.4125, lon: 120.5856, availableSpaces: 0 },
];

// Add parking locations to the map
parkingData.forEach((location) => {
    L.marker([location.lat, location.lon])
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>Available Spaces: ${location.availableSpaces}`);
});

// Search functionality
document.getElementById('search-btn').addEventListener('click', function () {
    const searchInput = document.getElementById('destination-search').value.trim();
    const destination = parkingData.find((loc) => loc.name.toLowerCase() === searchInput.toLowerCase());

    if (destination) {
        // Center map on the destination
        map.setView([destination.lat, destination.lon], 16);

        // Update the route
        control.setWaypoints([
            L.latLng(map.getCenter()), // Current center as start
            L.latLng(destination.lat, destination.lon), // Destination
        ]);

        // Simulate route calculation and ETA
        const eta = Math.floor(Math.random() * 30) + 5; // Random ETA between 5-30 minutes
        document.getElementById('eta').textContent = eta;

        // Check parking availability
        const availabilityText = destination.availableSpaces > 0
            ? `Available Parking Spaces: ${destination.availableSpaces}`
            : `Parking Full at ${destination.name}. You will be queued.`;

        document.getElementById('parking-availability').textContent = availabilityText;

        // Show reserve button if spaces are available
        const reserveBtn = document.getElementById('reserve-btn');
        if (destination.availableSpaces > 0) {
            reserveBtn.style.display = 'inline';
        } else {
            reserveBtn.style.display = 'none';
        }

        // Display route information
        document.getElementById('route-info').style.display = 'block';
    } else {
        alert('Destination not found. Please check the name and try again.');
    }
});

// Reserve parking functionality
document.getElementById('reserve-btn').addEventListener('click', function () {
    alert('Parking space reserved successfully!');
});
