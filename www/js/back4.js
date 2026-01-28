const API_KEY = "c75100800e9b33cff479a6de06687299";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_BASE_URL = "https://openweathermap.org/img/wn/";
const UNITS = "metric";
const LANG = "pl";

const cityInput = document.getElementById('city-input');
const weatherButton = document.getElementById('weather-button');
const currentWeatherResults = document.getElementById('current-weather-results');
const forecastResults = document.getElementById('forecast-results');

weatherButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city); 
    } else {
        currentWeatherResults.innerHTML = "Wprowadź nazwę miejscowości!";
        forecastResults.innerHTML = "";
    }
});

function fetchCurrentWeather(city) {
    const url = `${CURRENT_URL}?q=${city}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
    
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log('Odpowiedź Current Weather (XMLHttpRequest):', response);
            displayCurrentWeather(response);
        } else {
            currentWeatherResults.innerHTML = `Błąd pobierania bieżącej pogody. Status: ${xhr.status}`;
        }
    };

    xhr.onerror = function() {
        currentWeatherResults.innerHTML = "Błąd połączenia sieciowego.";
    };

    xhr.send();
}

function displayCurrentWeather(data) {
    if (data.cod === 200) {
        
        const currentTime = new Date(data.dt * 1000); 
        
        const dateTimeOptions = {
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        
        const formattedDateTime = currentTime.toLocaleDateString('pl-PL', dateTimeOptions);
        
        const iconCode = data.weather[0].icon;
        const iconUrl = `${ICON_BASE_URL}${iconCode}@2x.png`;
        
        currentWeatherResults.innerHTML = `
            <p class="current-time">${formattedDateTime}</p> 
            
            <p class="current-location">${data.name}, ${data.sys.country}</p> 
            <hr class="current-separator">
            
            <div class="weather-icon-container">
                <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon-large">
                <p class="main-temp-display">${Math.round(data.main.temp)}°C</p>
            </div>

            <p>Warunki: ${data.weather[0].description}</p>
            <p>Odczuwalna: ${Math.round(data.main.feels_like)}°C</p>
            <p>Wiatr: ${data.wind.speed} m/s</p>
        `;
    } else {
        currentWeatherResults.innerHTML = `Nie znaleziono danych dla podanej miejscowości.`;
    }
}

async function fetchForecast(city) {
    const url = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Błąd HTTP! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Odpowiedź Forecast (Fetch API):', data);
        displayForecast(data);
        
    } catch (error) {
        forecastResults.innerHTML = `Błąd pobierania prognozy: ${error.message}`;
    }
}

function displayForecast(data) {
    if (data.cod === "200") {
        let output = `<h3>Prognoza dla ${data.city.name}</h3>`;
        output += '<div>';
        
        let lastDay = null; 
        let offsetHours = 0; 
        let forecastsDisplayed = 0; 

        data.list.forEach(item => {
            if (forecastsDisplayed >= 5) return; 

            const time = new Date(item.dt * 1000);
            const currentDay = time.getDate();

            if (lastDay === null || currentDay !== lastDay) {
                
                const requiredUTCHour = (12 + offsetHours) % 24;

                if (time.getUTCHours() === requiredUTCHour) {
                    
                    const dateOptions = { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                    };
                    const timeString = time.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                    
                    const iconCode = item.weather[0].icon;
                    const iconUrl = `${ICON_BASE_URL}${iconCode}.png`; 
                    
                    const dateTimeLine = 
                        `<strong>${time.toLocaleDateString('pl-PL', dateOptions)} ${timeString}</strong>`;

                    output += `
                        <div class="forecast-item"> 
                            
                            <p>${dateTimeLine}</p>
                            
                            <img src="${iconUrl}" alt="${item.weather[0].description}" class="weather-icon-small">
                            <p>Temperatura: ${Math.round(item.main.temp)}°C</p>
                            <p>Odczuwalna: ${Math.round(item.main.feels_like)}°C</p>
                            <p>Warunki: ${item.weather[0].description}</p>
                        </div>
                    `;
                    
                    lastDay = currentDay;
                    offsetHours += 3;
                    forecastsDisplayed++;
                }
            }
        });
        
        output += '</div>';
        forecastResults.innerHTML = output;
    } else {
        forecastResults.innerHTML = `Nie znaleziono prognozy dla podanej miejscowości.`;
    }
}