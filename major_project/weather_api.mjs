import { WEATHER_API_KEY } from "./API_KEYS.mjs";

const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}`;
const IP_API_URL = 'https://api.ipify.org/?format=json';

const WEATHER_API_URL_OPTIONS = {
	method: 'GET'
};

const WEATHER_API_DAY_COUNT = 3;


export class weatherAPI
{
    #location;
    #forecastInfo = null;

    constructor(location)
    {
        //sets current location for next load
        this.setLocationAsCity(location)

    }

    setLocationAsCity(city)
    {
        //cook city name
        city = city.trim();
        city = city.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
        city = city.replaceAll(' ', '-');

        //update city name in search
        this.#location = location
    }

    

    //Gets weatherData from saved city
    async updateWeatherData()
    {
        //prep local url
        let url = WEATHER_API_URL;
        url += `&q=${this.#location}&days=${WEATHER_API_DAY_COUNT}`;

        //get response
        try {
            const response = await fetch(url, WEATHER_API_URL_OPTIONS);
            if (response.ok) {
                const result = await response.json();
                this.#forecastInfo = result;
            } else {
                throw(response.status);
            }
        } catch (error) {

        }
    }

    getWeatherData()
    {
        return this.#forecastInfo;
    }
}