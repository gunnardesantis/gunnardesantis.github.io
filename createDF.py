import pandas as pd

# Sample data for the beach DataFrame
data = {
    'Beach Name': ['Santa Monica Beach', 'Miami Beach', 'Waikiki Beach', 'Myrtle Beach'],
    'Longitude': [-118.4961, -80.1300, -157.8557, -78.8867],
    'Latitude': [34.0100, 25.7900, 21.2785, 33.6891],
    'City': ['Santa Monica', 'Miami', 'Honolulu', 'Myrtle Beach'],
    'State': ['CA', 'FL', 'HI', 'SC']
}

# Create a DataFrame for beach data
beach_df = pd.DataFrame(data)

# Save the DataFrame as a CSV file
beach_df.to_csv('beach_data.csv', index=False)

print("Beach DataFrame saved as 'beach_data.csv'")
