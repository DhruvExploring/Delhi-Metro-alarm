// Delhi Metro Stations Data
const delhiMetroStations = {
    "Rajiv Chowk": { lat: 28.6328, lng: 77.2197 },
    "Kashmere Gate": { lat: 28.6667, lng: 77.2167 },
    "Central Secretariat": { lat: 28.6129, lng: 77.2093 },
    "Hauz Khas": { lat: 28.5441, lng: 77.1986 },
    "Karol Bagh": { lat: 28.6517, lng: 77.1909 },
    "New Delhi": { lat: 28.6421, lng: 77.2206 },
    "Chandni Chowk": { lat: 28.6506, lng: 77.2306 },
    "Punjabi Bagh": { lat: 28.6700, lng: 77.1200 },
};

// DOM Elements
const metroStationDropdown = document.getElementById("metroStation");
const startAlarmBtn = document.getElementById("startAlarm");
const stopAlarmBtn = document.getElementById("stopAlarm");
const alarmStatus = document.getElementById("alarmStatus");
const locationStatus = document.getElementById("locationStatus");

let alarmInterval;
let alarmSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');

// Populate dropdown with Delhi Metro stations
for (const station in delhiMetroStations) {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    metroStationDropdown.appendChild(option);
}

// Start Alarm Button Click
startAlarmBtn.addEventListener("click", () => {
    const selectedStation = metroStationDropdown.value;
    if (!selectedStation) {
        alert("Please select a metro station first!");
        return;
    }
    
    startAlarmBtn.disabled = true;
    stopAlarmBtn.disabled = false;
    alarmStatus.textContent = "🟢 Alarm: ACTIVE (Waiting for proximity)";
    
    // Check location every 10 seconds
    alarmInterval = setInterval(() => checkProximity(selectedStation), 10000);
    checkProximity(selectedStation); // Immediate first check
});

// Stop Alarm Button Click
stopAlarmBtn.addEventListener("click", () => {
    clearInterval(alarmInterval);
    startAlarmBtn.disabled = false;
    stopAlarmBtn.disabled = true;
    alarmStatus.textContent = "🔴 Alarm: OFF";
    locationStatus.textContent = "📍 Alarm stopped.";
    alarmSound.pause();
});

// Check if user is near the selected metro station
function checkProximity(stationName) {
    if (!navigator.geolocation) {
        locationStatus.textContent = "❌ Geolocation not supported!";
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const station = delhiMetroStations[stationName];
            
            const distance = calculateDistance(
                userLat, userLng,
                station.lat, station.lng
            );
            
            locationStatus.textContent = `📏 Distance from ${stationName}: ${distance.toFixed(2)} km`;
            
            // Trigger alarm if within 500 meters (0.5 km)
            if (distance < 0.5) {
                alarmStatus.textContent = "🚨 ALARM: YOU'VE REACHED " + stationName + "!";
                alarmSound.play();
            }
        },
        (error) => {
            locationStatus.textContent = "❌ Error getting location: " + error.message;
        }
    );
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
