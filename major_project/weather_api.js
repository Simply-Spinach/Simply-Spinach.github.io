const WEATHER_API_KEY = 'e743aae5077a47e79e1231340260704';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}`;
const IP_API_URL = 'https://api.ipify.org/?format=json';

const WEATHER_API_URL_OPTIONS = {
	method: 'GET'
};

const WEATHER_API_DAY_COUNT = 3;

class weatherAPI
{
    #location;
    #mForecastInfo;

    constructor(location)
    {
        //sets current location for next load
        this.setLocation(location)

    }

    setLocationAsCity(city)
    {
        //cook city name
        city = city.trim();
        city = city.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
        city = city.replaceAll(' ', '-');

        this.#location = location

        //update self here
    }

    

    //Gets weatherData from a city, with a dayCount forecast
    async getWeatherData(city, dayCount) {

        return await rawInputGetWeatherData(city,dayCount);
    }

    //Same as getWeatherData but doesn't cook the city input
    async rawInputGetWeatherData(city, dayCount)
    {
        //prep local url
        let url = WEATHER_API_URL;
        url += `&q=${city}&days=${dayCount}`;

        //get response
        try {
            const response = await fetch(url, WEATHER_API_URL_OPTIONS);
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                throw(response.status);
            }
        } catch (error) {

        }
    }
}