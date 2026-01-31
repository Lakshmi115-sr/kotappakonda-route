// 1. Initial Map Setup (Centered on Kotappakonda)
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // We will replace this with your offline file later
    center: [80.039, 16.145], 
    zoom: 14
});

// 2. Define the Festival Bounding Box
const BBOX = { minLat: 16.125, maxLat: 16.185, minLng: 80.015, maxLng: 80.080 };

// 3. Geofencing Logic
function checkLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const statusEl = document.getElementById('status-bar');

        const isInside = latitude >= BBOX.minLat && latitude <= BBOX.maxLat && 
                         longitude >= BBOX.minLng && longitude <= BBOX.maxLng;

        if (isInside) {
            statusEl.innerText = "You are inside the Jathara Zone";
            statusEl.className = "mt-2 py-1 px-4 rounded-full text-sm font-bold in-zone";
        } else if (Math.abs(latitude - 16.145) < 0.1) {
            statusEl.innerText = "Boundary: Moving away from Hill";
            statusEl.className = "mt-2 py-1 px-4 rounded-full text-sm font-bold out-zone";
        } else {
            statusEl.innerText = "Remote Mode (Viewing from Outside)";
            statusEl.className = "mt-2 py-1 px-4 rounded-full text-sm font-bold remote";
        }
    });
}

// 4. WhatsApp Share Logic
function shareLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
        const text = `I am at Kotappakonda Jathara. My location: https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    });
}

// 5. Simple Service Info (Alerts for now)
function showInfo(type) {
    const data = {
        'Bus Stop': 'Shuttles available from Narasaraopet & Foothills every 15 mins.',
        'Ambulance': 'Emergency Medical Camps at Sector 1, 5, and 10. Call 108.',
        'Temple': 'Darshan: 6 AM to 10 PM. Special Pujas at midnight.',
        'Parking': 'Main parking at Nagireddy Guest House & Foothills.',
        'Prabhalu': 'Chariots arrive at the base junction by 4:00 PM.'
    };
    alert(data[type]);
}

checkLocation();