const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const locationText = document.getElementById("location");
const dateElement = document.getElementById("date");
const temperatureText = document.getElementById("temp");
const dailyForecastElems = document.getElementById("forecast");
const weatherDisplay = document.getElementById("weather-display");

//find city coordinates
async function getLocation(city)   {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Location not found. Please try again.");
    }
    const result = data.results[0];

    return {
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude
    };
}

//coordinates for weather
async function getWeather(city) {
    const {latitude, longitude, name} = await getLocation(city);
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m&timezone=America%2FLos_Angeles&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`);
    
    const data = await response.json();
    return {
        name,
        current: data.current.temperature_2m,
        daily: data.daily
        //max: data.daily.temperature_2m_max,
        //min: data.daily.temperature_2m_min
    };
}

//search button
searchButton.addEventListener("click", async (e) => {
    e.preventDefault();
    dailyForecastElems.innerHTML = " ";

    const city = cityInput.value.trim();
    if (!city) {
        alert("Please enter a location");
        return;
    }
    try {
        const weather = await getWeather(city);

        locationText.textContent = weather.name;
        temperatureText.textContent =   `${weather.current}°F`;
        
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
        //forecast for 7 days..
        for(let i=0; i<7; i++) {
            const temperatureMax = weather.daily.temperature_2m_max[i];
            const temperatureMin = weather.daily.temperature_2m_min[i];
            
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
             });

        //element for forecast

        const forecastElem = document.createElement("div");
        forecastElem.classList.add("forecast-day");
        forecastElem.innerHTML = `
            <strong>${dateStr}</strong><br>
            High: ${temperatureMax}°F<br>
            Low: ${temperatureMin}°F
            `;
            dailyForecastElems.appendChild(forecastElem);
        }
        //to display weather
        weatherDisplay.style.display = "block";
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather. Please try again later. Try another location?");
    }
});

