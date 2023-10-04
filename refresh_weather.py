import csv
import time
import requests

# Your OpenWeather API key
api_key = "57056333dfe0e734eefdcc7ae2aaf7da"

# Function to fetch updated weather data for a beach and update the CSV file
def refresh_beach_data(beach):
    # Construct the API URL for weather data based on beach coordinates
    api_url = f"https://api.openweathermap.org/data/2.5/onecall?lat={beach['latitude']}&lon={beach['longitude']}&exclude=minutely,hourly&appid={api_key}&units=imperial"

    # Make an HTTP request to fetch updated weather data
    response = requests.get(api_url)

    if response.status_code == 200:
        weather_data = response.json()
        # Extract the relevant weather information (e.g., UV index, description, temperature)
        updated_data = {
            "uvi": weather_data["daily"][0]["uvi"],
            "weather": weather_data["daily"][0]["weather"][0]["description"],
            "temperature": weather_data["daily"][0]["temp"]["day"]
        }
        beach.update(updated_data)  # Update the beach data

# Function to load beach data from the CSV file
def load_beach_data():
    beach_data = []
    with open('beach_data.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            beach_data.append(row)
    return beach_data

# Function to save beach data to the CSV file
def save_beach_data(beach_data):
    with open('beach_data.csv', 'w', newline='') as csvfile:
        fieldnames = beach_data[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for beach in beach_data:
            writer.writerow(beach)

if __name__ == "__main__":
    # Load beach data from the CSV file
    beaches = load_beach_data()

    while True:
        # Refresh weather data for each beach
        for beach in beaches:
            refresh_beach_data(beach)

        # Save the updated data to the CSV file
        save_beach_data(beaches)

        # Wait for 24 hours before refreshing again
        time.sleep(86400)  # 86400 seconds = 24 hours
