// Select the city selection container for appending city selection buttons
const CITY_SEL = document.querySelector('#city_selection_container');

class City 
{
    constructor (name, latitude, longitude) 
    {
        this.name       = name;
        this.latitude   = latitude;
        this.longitude  = longitude;
        // This defines whether or not the city is saved to local storage (the city has previously been selected)
        this.saved = localStorage.getItem(name) === 'selected';
    }

    save ()
    {
        // Update the saved property for this instance
        this.saved = true;
        
        localStorage.setItem(this.name, 'selected')
    }
    
    generate_sel () 
    {
        // Create city selection button element
        let cs_btn = document.createElement("button");

        cs_btn.className = 'cs_btn';

        // Set the city data attribute and button text to this city's name
        cs_btn.dataset.city = cs_btn.innerText = this.name;

        // Append button to its container
        CITY_SEL.appendChild(cs_btn);
    }
}

let cities = 
{
    // 'New York': 
    //     new City('New York', 40.7128, -74.0060),
    // 'London':
    //     new City('London', 51.5072, -0.1276),
    // 'Boston':
    //     new City('Boston', 42.3611, -71.0571),
    // 'Paris': 
    //     new City('Paris', 48.8566, 2.3522),
    // 'Phoenix':
    //     new City('Phoenix', 33.4483, -112.0740),
    // 'Tokyo':
    //     new City('Tokyo', 35.6762, 139.6503),
    // 'Austin': 
    //     new City('Austin', 30.2667, -97.7333),
    // 'Chicago':
    //     new City('Chicago', 41.8818, -87.6232),
    // 'San Francisco':
    //     new City('San Francisco', 37.7338, -122.4467),
    // 'Seattle': 
    //     new City('Seattle', 40.7128, -122.3351),
    // 'Denver':
    //     new City('Denver', 39.7420, -104.9915),
    // 'Atlanta':
    //     new City('Atlanta', 33.7537, -84.3863),
}

// Iterate through cities to determine which have previously been selected, and display them if so
for (const city in cities)
{
    if (cities[city].saved)
        cities[city].generate_sel();
}
