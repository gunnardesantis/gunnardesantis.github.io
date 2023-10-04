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
