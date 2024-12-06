// Initialize the map
const map = L.map('map').setView([16.4023, 120.5981], 15); // Default location: Baguio City
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Mock JSON URL for parking data
const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts/1';

// Function to create a route
function addRouteToMap(startLat, startLng, endLat, endLng) {
    L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLng),  // Starting point
            L.latLng(endLat, endLng)      // Destination point
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        altLineOptions: {
            styles: [{ color: 'red', opacity: 0.7, weight: 4 }]
        }
    }).addTo(map);
}

// Event Listener for Search Button
document.getElementById('search-btn').addEventListener('click', () => {
    const location = document.getElementById('location').value;

    if (!location) {
        alert('Please enter a destination.');
        return;
    }

    // Fetch destination details from mock API (replace this with actual API logic if needed)
    fetch(mockApiUrl)
        .then(response => response.json())
        .then(data => {
            // Mock destination coordinates (replace with real data from API)
            const destinationLat = 16.4023; // Example latitude
            const destinationLng = 120.5981; // Example longitude
            const userLat = 16.4090; // Example user's latitude
            const userLng = 120.6019; // Example user's longitude

            // Calculate ETA and update parking info (mock values for now)
            document.getElementById('eta-value').textContent = '10 minutes';
            document.getElementById('parking-spaces').textContent = '10';

            // Add route to map
            addRouteToMap(userLat, userLng, destinationLat, destinationLng);
        })
        .catch(error => console.error('Error fetching mock API:', error));
});

// Reserve Parking Space Button
document.getElementById('reserve-btn').addEventListener('click', () => {
    alert('Parking space reserved successfully!');
});
