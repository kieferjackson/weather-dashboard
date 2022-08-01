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

document.addEventListener( 'click', (event) => 
{
    if (event.target.className === "cs_btn")
    {
        let city_name = event.target.dataset.city;

        // Get the coordinates of the selected city
        let lat_coord = cities[city_name].latitude;
        let lon_coord = cities[city_name].longitude;
    
        let forecast_url = `${OW_URL}?lat=${lat_coord}&lon=${lon_coord}&units=imperial&appid=${API_KEY}`;

        get_weather_forecast(forecast_url, city_name);
    }
});

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
        display_weather_forecast(data);

        console.log(data);

    });
}

function display_weather_conditions (weather_data, city_name) 
{
    // Clear the forecast container if there are already forecasts in it
    if (CITY_CONDITIONS.childElementCount > 0)
    {
        CITY_CONDITIONS.children[0].remove();
    }

    let weather_desc = get_weather_description(weather_data.current);

    // Get the current date
    let date = new Date (weather_data.current.dt * 1000);

    let month   =   date.toLocaleString("en-US", {month: "numeric"});
    let day     =   date.toLocaleString("en-US", {day: "numeric"});
    let year    =   date.toLocaleString("en-US", {year: "numeric"});

    // Create heading with city name and its date
    let city_heading = document.createElement("h3");
    city_heading.innerHTML = `${city_name} (${month}/${day}/${year}) ${WEATHER_ICONS[weather_desc]}`;

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

    // Create container for the city's current weather conditions
    let current_conditions = document.createElement("section");

    // Append heading and weather conditions to page
    current_conditions.appendChild(city_heading);
    current_conditions.appendChild(conditions);
    CITY_CONDITIONS.appendChild(current_conditions);
}

function display_weather_forecast(weather_data)
{
    // Clear the forecast container if there are already forecasts in it
    if (CITY_FORECAST.childElementCount > 0)
    {
        CITY_FORECAST.children[0].remove();
    }

    // Create container for the city's five day forecasts
    let fiveday_forecasts = document.createElement("section");

    let weekly_forecast = weather_data.daily;
    const FORECAST_DAYS = 5;

    // Iterate through five days away from the current date
    for (var i = 1 ; i <= FORECAST_DAYS ; i++) 
    {
        let forecast = document.createElement("section");
        forecast.className = 'forecast_box';

        // Get the date of this forecast
        let date = new Date (weekly_forecast[i].dt * 1000);

        let month   =   date.toLocaleString("en-US", {month: "numeric"});
        let day     =   date.toLocaleString("en-US", {day: "numeric"});
        let year    =   date.toLocaleString("en-US", {year: "numeric"});

        // Create the heading for the forecast's date
        let forecast_date = document.createElement("h3");
        forecast_date.innerText = `${month}/${day}/${year}`;

        // Create the paragraph for conditions to be displayed
        let forecast_conditions = document.createElement("p");

        // Set the weather icon
        let weather_desc = get_weather_description(weekly_forecast[i]);

        forecast_conditions.innerHTML = 
        `
            ${WEATHER_ICONS[weather_desc]} <br>
            Temp: ${weekly_forecast[i].temp.day} F <br>
            Wind: ${weekly_forecast[i].wind_speed} mph<br>
            Humidity: ${weekly_forecast[i].humidity}%<br>
        `;

        forecast.appendChild(forecast_date);
        forecast.appendChild(forecast_conditions);

        fiveday_forecasts.appendChild(forecast)
    }

    CITY_FORECAST.appendChild(fiveday_forecasts)
}

function get_weather_description (weather_data)
{
    let weather_desc = weather_data.weather[0].main;
    let weather_id = weather_data.weather[0].id;
    
    // Check for atmospheric weather conditions (fog, dust, etc) between 700 and 800
    if (weather_id > 700 || weather_id < 800)
        weather_desc = 'Atmosphere';

    return weather_desc;
}