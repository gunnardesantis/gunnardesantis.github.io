const apiKey = "57056333dfe0e734eefdcc7ae2aaf7da";

let beaches = []; // Array to store beach data

// Load and parse the CSV file
Papa.parse("beach_data.csv", {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
        beaches = results.data;
        // Call a function to populate the beach list
        updateGeneralForecast();
    }
});

let generalForecast = true;

// Add a click event listener to open the login modal
document.getElementById("open-login-modal").addEventListener("click", function() {
    document.getElementById("login-modal").style.display = "block";
});

// Add a click event listener to close the login modal
document.getElementById("close-login-modal").addEventListener("click", function() {
    document.getElementById("login-modal").style.display = "none";
});

// Handle the login form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the entered username and password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Perform authentication logic here (e.g., checking against a database)
    // Replace this with your actual authentication code
    if (username === "your_username" && password === "your_password") {
        alert("Login successful!");
        // Close the modal after successful login
        document.getElementById("login-modal").style.display = "none";
    } else {
        alert("Login failed. Please check your credentials.");
    }
});


function updateGeneralForecast() {
    generalForecast = true;
    const beachList = document.getElementById("beach-list");
    beachList.innerHTML = '';

    beaches.forEach((beach) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${beach.latitude}&lon=${beach.longitude}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const tanningForecast = data.daily.slice(0, 5); // Get the forecast for the next 5 days

                const tanningForecastCard = document.createElement("div");
                tanningForecastCard.classList.add("col-md-4"); // Use Bootstrap's grid system
                tanningForecastCard.innerHTML = `
                    <div class="tanning-forecast-card">
                        <img src="${beach.image}" alt="${beach.name}" class="beach-image">
                        <h2>${beach.name}</h2>
                        <div class="forecast-details">
                            ${tanningForecast.map((day) => `
                                <div class="day-forecast">
                                    <p>${new Date(day.dt * 1000).toLocaleDateString()}: UV Index: ${day.uvi.toFixed(2)}, Weather: ${day.weather[0].description}, Temperature: ${day.temp.day.toFixed(2)}°F</p>
                                    <div class="score-box score-${calculateScore(day.uvi)}">${calculateScore(day.uvi)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                beachList.appendChild(tanningForecastCard);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    });
}

function calculateScore(uvIndex) {
    if (uvIndex >= 1 && uvIndex <= 10) {
        return Math.round((uvIndex / 10) * 9 + 1);
    } else {
        return 0;
    }
}

function recommendBeach(dayIndex) {
    generalForecast = false;
    const beachList = document.getElementById("beach-list");
    beachList.innerHTML = '';

    beaches.forEach((beach) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${beach.latitude}&lon=${beach.longitude}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const tanningForecast = data.daily[dayIndex];
                const score = calculateScore(tanningForecast.uvi);

                const tanningForecastCard = document.createElement("div");
                tanningForecastCard.classList.add("col-md-4"); // Use Bootstrap's grid system
                tanningForecastCard.innerHTML = `
                    <div class="tanning-forecast-card">
                        <img src="${beach.image}" alt="${beach.name}" class="beach-image">
                        <h2>${beach.name}</h2>
                        <div class="forecast-details">
                            <div class="day-forecast">
                                <p>${new Date(tanningForecast.dt * 1000).toLocaleDateString()}: UV Index: ${tanningForecast.uvi}, Weather: ${tanningForecast.weather[0].description}, Temperature: ${tanningForecast.temp.day}°F</p>
                            </div>
                        </div>
                        <div class="score-box score-${score}">${score}</div>
                    </div>
                `;

                beachList.appendChild(tanningForecastCard);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    });
}

function goBackToGeneralForecast() {
    if (!generalForecast) {
        updateGeneralForecast();
    }
}

// script.js

// Sample data for tanning forecasts
const tanningForecasts = [
    { beachName: "Beach 1", forecast: "Sunny and warm" },
    { beachName: "Beach 2", forecast: "Partly cloudy" },
    { beachName: "Beach 3", forecast: "Clear skies" },
    // Add more forecast data as needed
];

// Function to generate and insert tanning forecast cards
function insertTanningForecastCards() {
    const beachList = document.getElementById("beach-list");

    // Clear any existing cards
    beachList.innerHTML = "";

    // Loop through the tanning forecasts and create cards
    tanningForecasts.forEach((forecast, index) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4"); // Adjust the column size as needed
        card.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">${forecast.beachName}</h5>
                    <p class="card-text">${forecast.forecast}</p>
                </div>
            </div>
        `;

        // Append the card to the beachList container
        beachList.appendChild(card);
    });
}

// Call the function to insert tanning forecast cards when the page loads
window.onload = insertTanningForecastCards;
