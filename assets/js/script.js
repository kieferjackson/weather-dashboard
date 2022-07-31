const OW_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const API_KEY = '5e421b2b8615d032baea541e45065bb4';

const CITY_FIELD = document.querySelector('#city_input');
const CITY_CONDITIONS = document.querySelector('#city_conditions');
const CITY_FORECAST = document.querySelector('#city_forecast');

const WEATHER_ICONS = 
{
    Thunderstorm: '&#127785',
    Drizzle: '&#127782',
    Rain: '&#127783',
    Snow: '&#127784',
    Clear: '&#127774',
    Clouds: '&#127781',
    Atmosphere: '&#127786'
};

function search_city() 
{
    let sel_city = CITY_FIELD.value;

    if (cities[sel_city] === undefined)
    {
        // The selected city is not one of the available options
        console.log(`${sel_city} is not a valid option`);
    }
    else
    {
        // Check if that city has previously been selected and saved locally
        if (!cities[sel_city].saved) 
        {
            // Save this city to local storage
            cities[sel_city].save();

            // Create a button to select this city again in the future
            cities[sel_city].generate_sel();
        }
        
        // Get the coordinates of the selected city
        let lat_coord = cities[sel_city].latitude;
        let lon_coord = cities[sel_city].longitude;
    
        let forecast_url = `${OW_URL}?lat=${lat_coord}&lon=${lon_coord}&units=imperial&appid=${API_KEY}`;
    
        get_weather_forecast(forecast_url, sel_city);
    }

    
}



function get_weather_forecast(requested_url, city_name) 
{
fetch(requested_url)
    .then( (response) => {
    // Log the requested url address
    console.log(`Data from: ${requested_url}`);
    
    return response.json();
    })
    .then( (data) => {
        // Display current weather conditions
        display_weather_conditions(data, city_name);

        // Display five day weather forecast
        display_weather_forecast(data, city_name);

        console.log(data);

    });
}

function display_weather_conditions (weather_data, city_name) 
{
    let weather_desc = get_weather_description(weather_data);

    // Create heading with city name and its date
    let city_heading = document.createElement("h3");
    city_heading.innerHTML = `${city_name} ${WEATHER_ICONS[weather_desc]}`;

    let uv_index = weather_data.current.uvi;
    let uvi_danger;

    // Check UV Index value
    if (uv_index < 3)
        uvi_danger = 'low'; 
    
    else if (uv_index < 6)
        uvi_danger = 'moderate'; 
    
    else
        uvi_danger = 'severe'; 
    

    let conditions = document.createElement("p");
    conditions.innerHTML = 
    `
        Temp: ${weather_data.current.temp} F<br>
        Wind: ${weather_data.current.wind_speed} mph<br>
        Humidity: ${weather_data.current.humidity}% <br>
        UV Index: <em class='${uvi_danger}_warning'>${uv_index}</em> <br>
    `;

    // Append heading and weather conditions to page
    CITY_CONDITIONS.appendChild(city_heading);
    CITY_CONDITIONS.appendChild(conditions);
}

function display_weather_forecast(weather_data, city_name)
{

}

function get_weather_description (weather_data)
{
    let weather_desc = weather_data.current.weather[0].main;
    let weather_id = weather_data.current.weather[0].id;
    
    // Check for atmospheric weather conditions (fog, dust, etc) between 700 and 800
    if (weather_id > 700 || weather_id < 800)
        weather_desc = 'Atmosphere';

    return weather_desc;
}