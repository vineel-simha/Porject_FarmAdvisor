document.addEventListener('DOMContentLoaded', () => {
    
    // --- Clock and Date Functionality ---
    const liveClock = document.getElementById('live-clock');
    const currentDateEl = document.getElementById('current-date');

    function updateTimeAndDate() {
        const now = new Date();
        if(liveClock) {
            liveClock.textContent = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
        }
        if(currentDateEl) {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' };
            currentDateEl.textContent = now.toLocaleDateString('en-IN', options);
        }
    }
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);

    // --- Geolocation and Weather Fetching ---
    /* IMPORTANT: Since actual API Keys aren't provided in the prompt context but Fallback mock data is requested, 
       we will simulate API calls fetching realistic mock data for India as the default fallback. */

    const DUMMY_WEATHER_DB = {
        'Bangalore': { temp: 28, condition: 'Partly Cloudy ☁️', feels: '30°C', humidity: '65%', wind: '12 km/h', uv: 'High', alerts: ['warning', 'success'] },
        'Pune': { temp: 31, condition: 'Sunny ☀️', feels: '34°C', humidity: '45%', wind: '8 km/h', uv: 'Very High', alerts: ['success'] },
        'Delhi': { temp: 34, condition: 'Clear ☀️', feels: '38°C', humidity: '30%', wind: '5 km/h', uv: 'Extreme', alerts: ['warning'] },
        'Kochi': { temp: 29, condition: 'Thunderstorm ⛈️', feels: '33°C', humidity: '85%', wind: '20 km/h', uv: 'Moderate', alerts: ['warning'] },
        'default': { temp: 25, condition: 'Clear ☀️', feels: '26°C', humidity: '50%', wind: '10 km/h', uv: 'Moderate', alerts: [] }
    };

    const loader = document.getElementById('weather-loader');
    const content = document.getElementById('weather-content');
    const cityEl = document.getElementById('city-name');
    const stateEl = document.getElementById('state-name');

    // Ask for location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app we'd reverse geocode. Here we'll simulate Bangalore.
                loadWeatherData('Bangalore', 'Karnataka');
            },
            (error) => {
                // Fallback
                loadWeatherData('Bangalore', 'Karnataka (Default)');
            }
        );
    } else {
        loadWeatherData('Bangalore', 'Karnataka (Default)');
    }

    // Search functionality
    const searchInput = document.getElementById('location-search');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', () => {
        const val = searchInput.value.trim();
        if(val) {
            loader.style.display = 'block';
            content.style.display = 'none';
            // Simulate network delay
            setTimeout(() => {
                loadWeatherData(val, 'India');
            }, 800);
        }
    });

    function loadWeatherData(city, state) {
        cityEl.textContent = city;
        stateEl.textContent = state;

        // Fetch mock data
        let wData = DUMMY_WEATHER_DB[city.charAt(0).toUpperCase() + city.slice(1)];
        if(!wData) wData = DUMMY_WEATHER_DB['default'];

        // Populate Card
        document.getElementById('current-temp').textContent = `${wData.temp}°C`;
        document.getElementById('current-condition').textContent = wData.condition;
        document.getElementById('current-icon').textContent = wData.condition.split(' ')[1] || '☀️';
        document.getElementById('feels-like').textContent = wData.feels;
        document.getElementById('humidity').textContent = wData.humidity;
        document.getElementById('wind-speed').textContent = wData.wind;
        document.getElementById('uv-index').textContent = wData.uv;

        populateForecast();
        populateAlertsAndTips(wData);

        // Hide loader, show content
        loader.style.display = 'none';
        content.style.display = 'block';
    }

    function populateForecast() {
        const fc = document.getElementById('forecast-container');
        fc.innerHTML = '';
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let d = new Date().getDay();

        for(let i=1; i<=7; i++) {
            const nextDay = days[(d + i) % 7];
            const html = `
                <div class="forecast-card">
                    <div class="forecast-day">${i===1?'Tomorrow':nextDay}</div>
                    <div class="forecast-icon">${['☀️','☁️','🌥️','🌧️','⛈️'][Math.floor(Math.random()*5)]}</div>
                    <div class="forecast-temps">32° <span>22°</span></div>
                    <div class="forecast-rain">${Math.floor(Math.random()*6)*10}% rain</div>
                </div>
            `;
            fc.innerHTML += html;
        }
    }

    function populateAlertsAndTips(wData) {
        const ac = document.getElementById('alerts-container');
        ac.innerHTML = '';
        if(wData.temp > 33) {
            ac.innerHTML += `
                <div class="alert-box alert-warning">
                    <div class="alert-icon">⚠️</div>
                    <div><strong>High Temperature Alert:</strong> Expecting extreme heat. Ensure adequate irrigation across vegetable crops to prevent heat stress.</div>
                </div>
            `;
        } else if (wData.condition.includes('Thunderstorm')) {
            ac.innerHTML += `
                <div class="alert-box alert-warning">
                    <div class="alert-icon">⚠️</div>
                    <div><strong>Heavy Rain Warning:</strong> Expected heavy downpour. Postpone chemical spray schedules immediately.</div>
                </div>
            `;
        }
        
        if (wData.temp <= 30 && parseInt(wData.humidity) < 70) {
            ac.innerHTML += `
                <div class="alert-box alert-success">
                    <div class="alert-icon">✅</div>
                    <div><strong>Ideal Sowing Conditions:</strong> Excellent soil moisture and temperature for planting seeds this week.</div>
                </div>
            `;
        }

        if(ac.innerHTML === '') {
             ac.innerHTML += `
                <div class="alert-box alert-success">
                    <div class="alert-icon">✅</div>
                    <div><strong>Stable Weather:</strong> No extreme weather conditions expected today. Good time for regular field activities.</div>
                </div>
            `;
        }

        // Tips
        const tc = document.getElementById('tips-container');
        tc.innerHTML = `
            <div class="tip-card">
                <h4>💧 Irrigation Advice</h4>
                <p>${wData.temp > 30 ? 'High evaporation expected. Irrigate crops during evening hours to conserve water.' : 'Moisture levels are optimal. Regular, light irrigation is sufficient.'}</p>
            </div>
            <div class="tip-card">
                <h4>🐛 Pest Risk Level</h4>
                <p>${parseInt(wData.humidity) > 75 ? 'High humidity increases risk of fungal diseases. Monitor closely for leaf spots.' : 'Low to moderate risk. Regular monitoring recommended.'}</p>
            </div>
            <div class="tip-card">
                <h4>🚜 Spray Schedule</h4>
                <p>${wData.wind.includes('20') ? 'Winds are strong. Avoid pesticide spraying to prevent drift.' : 'Favorable conditions. Best time to spray is early morning.'}</p>
            </div>
        `;
    }
});
