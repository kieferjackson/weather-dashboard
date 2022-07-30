
class City 
{
    constructor (name, longitude, latitude) 
    {
        this.name       = name;
        this.latitude   = latitude;
        this.longitude  = longitude;
    }
    
}

let cities = 
{
    'New York': 
        new City('New York', 40.7128, 74.0060),
    'London':
        new City('London', 51.5072, 0.1276)
}
