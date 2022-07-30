const OW_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const API_KEY = '5e421b2b8615d032baea541e45065bb4';

const CITY_FIELD = document.querySelector('#city_input');

function search_city() 
{
    let sel_city = CITY_FIELD.value;

    let lat_coord = cities['New York'].latitude;
    let lon_coord = cities['New York'].longitude;

    let forecast_url = `${OW_URL}?lat=${lat_coord}&lon=${lon_coord}&units=imperial&appid=${API_KEY}`;

    get_weather_forecast(forecast_url);
}



function get_weather_forecast(requested_url) 
{
fetch(requested_url)
    .then( (response) => {
    // Log the requested url address
    console.log(`Data from: ${requested_url}`);
    
    return response.json();
    })
    .then( (data) => {
    console.log(data);

    });
}