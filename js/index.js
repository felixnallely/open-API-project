const apiURL = ("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,is_day&timezone=America%2FLos_Angeles&past_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit")

fetch(apiURL)
    .then(response =>{
        if (!response.ok) {
            throw new Error ("Failed to fetch data. Please try again later.");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log("Error fetching forecast", error);
    })