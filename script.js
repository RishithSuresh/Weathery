// script.js for Weathery
// Fetches weather data and updates the DOM

const apiKey = "fde8800482d1ee5134e0882bc57d1f69"; // Replace with your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// For multiple cities
const citiesList = document.getElementById("cities-list");
const defaultCities = ["London", "Tokyo", "Paris", "Sydney", "Dubai"];

async function getWeatherData(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) return null;
    return await response.json();
}

async function renderCitiesWeather() {
    citiesList.innerHTML = "Loading...";
    const weatherData = await Promise.all(defaultCities.map(getWeatherData));
    citiesList.innerHTML = weatherData.map((data, i) => {
        if (!data) {
            return `<div class="city-card"><h4>${defaultCities[i]}</h4><p>Not found</p></div>`;
        }
        let icon = "images/clear.png";
        switch (data.weather[0].main) {
            case "Clouds": icon = "images/clouds.png"; break;
            case "Clear": icon = "images/clear.png"; break;
            case "Rain": icon = "images/rain.png"; break;
            case "Drizzle": icon = "images/drizzle.png"; break;
            case "Mist": icon = "images/mist.png"; break;
            case "Snow": icon = "images/snow.png"; break;
        }
        return `<div class="city-card">
            <img src="${icon}" alt="${data.weather[0].main}" width="40">
            <h4>${data.name}</h4>
            <p>${Math.round(data.main.temp)}°C</p>
            <p>${data.weather[0].main}</p>
        </div>`;
    }).join("");
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
        document.querySelector(".city").innerText = "City Not Found";
        document.querySelector(".Temp").innerText = "-";
        document.querySelector(".humidity").innerText = "-";
        document.querySelector(".wind").innerText = "-";
        weatherIcon.src = "images/mist.png";
        return;
    }
    const data = await response.json();
    document.querySelector(".city").innerText = data.name;
    document.querySelector(".Temp").innerText = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerText = data.main.humidity + "%";
    document.querySelector(".wind").innerText = data.wind.speed + " km/h";

    if (data.weather[0].main === "Clouds") {
        weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main === "Clear") {
        weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main === "Rain") {
        weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main === "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main === "Mist") {
        weatherIcon.src = "images/mist.png";
    } else if (data.weather[0].main === "Snow") {
        weatherIcon.src = "images/snow.png";
    } else {
        weatherIcon.src = "images/clear.png";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Refresh other cities every 5 minutes
renderCitiesWeather();
setInterval(renderCitiesWeather, 300000);

searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Optionally, show default city on load
checkWeather("New York");
renderCitiesWeather();
