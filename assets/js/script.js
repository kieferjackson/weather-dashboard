const OW_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const GEO_CITY_URL = 'http://api.openweathermap.org/geo/1.0/direct';
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
    let sel_city = CITY_FIELD.value.toLowerCase();

    if (cities[sel_city] === undefined)
    {
        // Define the URL to find the coordinates of the entered city
        let city_url = `${GEO_CITY_URL}?q=${sel_city}&appid=${API_KEY}`;

        // The selected city has not previously been searched, so fetch the API for the city's coordinates
        get_city_coords(city_url, sel_city);
    }
    else
    {
        // Get the coordinates of the selected city
        let lat_coord = cities[sel_city].latitude;
        let lon_coord = cities[sel_city].longitude;
    
        let forecast_url = `${OW_URL}?lat=${lat_coord}&lon=${lon_coord}&units=imperial&appid=${API_KEY}`;
    
        get_weather_forecast(forecast_url, sel_city);
    }
}

function get_city_coords(city_url, city_name)
{
    fetch(city_url)
        .then( (response) => {
        // Log the requested url address
        console.log(`Data from: ${city_url}`);

        return response.json();
        })
        .then( (data) => {
            console.log(data);
            let city_data = data[0];

            // Check that the searched city is in the OpenWeather API
            if (city_data !== undefined)
            {
                // Add searched city to cities array, save locally, and generate the selection button
                cities[city_name] = new City (city_data.name, city_data.lat, city_data.lon);
                cities[city_name].save();
                cities[city_name].generate_sel();

                // Now that the city coords have been fetched, fetch the API and get the weather forecast
                let lat_coord = cities[city_name].latitude;
                let lon_coord = cities[city_name].longitude;

                let forecast_url = `${OW_URL}?lat=${lat_coord}&lon=${lon_coord}&units=imperial&appid=${API_KEY}`;

                get_weather_forecast(forecast_url, city_name);
            }
            else
                console.log(`${city_name} is not a valid city name. Please try again`);

        });
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
    city_heading.innerHTML = `${cities[city_name].name} (${month}/${day}/${year}) ${WEATHER_ICONS[weather_desc]}`;
    
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
    let fiveday_forecasts = document.createElement("div");
    fiveday_forecasts.className = 'row';

    let weekly_forecast = weather_data.daily;
    const FORECAST_DAYS = 5;

    // Iterate through five days away from the current date
    for (var i = 1 ; i <= FORECAST_DAYS ; i++) 
    {
        let forecast = document.createElement("div");
        forecast.className = 'forecast_box card col-sm-4';

        let fc_card_body = document.createElement("div");
        fc_card_body.className = 'card-body';

        // Get the date of this forecast
        let date = new Date (weekly_forecast[i].dt * 1000);

        let month   =   date.toLocaleString("en-US", {month: "numeric"});
        let day     =   date.toLocaleString("en-US", {day: "numeric"});
        let year    =   date.toLocaleString("en-US", {year: "numeric"});

        // Create the heading for the forecast's date
        let forecast_date = document.createElement("h3");
        forecast_date.innerText = `${month}/${day}/${year}`;
        forecast_date.className = 'card-title';

        // Create the paragraph for conditions to be displayed
        let forecast_conditions = document.createElement("p");
        forecast_conditions.className = 'card-text';

        // Set the weather icon
        let weather_desc = get_weather_description(weekly_forecast[i]);

        forecast_conditions.innerHTML = 
        `
            ${WEATHER_ICONS[weather_desc]} <br>
            Temp: ${weekly_forecast[i].temp.day} F <br>
            Wind: ${weekly_forecast[i].wind_speed} mph<br>
            Humidity: ${weekly_forecast[i].humidity}%<br>
        `;

        fc_card_body.appendChild(forecast_date);
        fc_card_body.appendChild(forecast_conditions);

        forecast.appendChild(fc_card_body);

        fiveday_forecasts.appendChild(forecast)
    }

    CITY_FORECAST.appendChild(fiveday_forecasts)
}

function get_weather_description (weather_data)
{
    let weather_desc = weather_data.weather[0].main;
    let weather_id = weather_data.weather[0].id;
    
    // Check for atmospheric weather conditions (fog, dust, etc) between 700 and 800
    if (weather_id > 700 && weather_id < 800)
        weather_desc = 'Atmosphere';

    return weather_desc;
}