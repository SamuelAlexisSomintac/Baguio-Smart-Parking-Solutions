// Initialize the map
const map = L.map('map').setView([16.4023, 120.5981], 15); // Default location: Baguio City
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to display user's location
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Center the map on the user's location
                map.setView([userLat, userLng], 15);

                // Add "You Are Here" marker
                L.marker([userLat, userLng]).addTo(map)
                    .bindPopup("You Are Here").openPopup();

                console.log("User's location:", userLat, userLng);
                console.log("Destination Location:",destinationLat,destinationLng);
            },
            (error) => {
                console.error("Error getting user location:", error.message);
                alert("Unable to access your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Call the function to locate the user
locateUser();

// Function to add routing between user's location and destination
function addRouting(userLat, userLng, destinationLat, destinationLng) {
    L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),       // User's current location
            L.latLng(destinationLat, destinationLng) // Destination
        ],
        routeWhileDragging: true,           // Allows users to drag the route
        lineOptions: {
            styles: [{ color: 'red', weight: 4 }]
        }
    }).addTo(map);
}

// Function to fetch destination data and add routing
function fetchDestinationAndRoute() {
    const mockJsonUrl = "parking-data.json"; // Replace with the actual path or URL
    fetch(mockJsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            const destination = data.destination; // Extract destination data
            const destinationLat = destination.latitude;
            const destinationLng = destination.longitude;

            // Check if user's location is available
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;

                        // Add routing from user's location to the destination
                        addRouting(userLat, userLng, destinationLat, destinationLng);
                        console.log(`Routing to: ${destination.name}`);
                    },
                    (error) => {
                        console.error("Error getting user location:", error.message);
                        alert("Unable to access your location. Please enable location services.");
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        })
        .catch(error => {
            console.error("Error fetching destination data:", error.message);
            alert("Failed to fetch destination data. Please try again.");
        });
}


// Attach event listener to the search button
document.getElementById("search-btn").addEventListener("click", fetchDestinationAndRoute);
