// Select the city selection container for appending city selection buttons
const CITY_SEL = document.querySelector('#city_selection_container');

// Container for all selected cities
let cities = JSON.parse(localStorage.getItem('cities'));

class City 
{
    constructor (name, latitude, longitude) 
    {
        this.name       = name;
        this.latitude   = latitude;
        this.longitude  = longitude;
    }

    save ()
    {
        // Update the local cities object with this city
        localStorage.setItem('cities', JSON.stringify(cities));
    }
    
    generate_sel () 
    {
        // Create city selection button element
        let cs_btn = document.createElement("button");

        cs_btn.className = 'cs_btn';

        // Set the city data attribute and button text to this city's name
        cs_btn.dataset.city = this.name.toLowerCase();
        cs_btn.innerText = this.name;

        // Append button to its container
        CITY_SEL.appendChild(cs_btn);
    }
}

// Iterate through cities to determine which have previously been selected, and display them if so
for (const city in cities)
{
    let current_city = cities[city];
    cities[city] = new City (current_city.name, current_city.latitude, current_city.longitude);

    cities[city].generate_sel();
}
