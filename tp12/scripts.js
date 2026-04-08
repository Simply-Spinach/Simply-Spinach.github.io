const API_KEY = 'e743aae5077a47e79e1231340260704';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}`;
let city = 'Klamath Falls'
const WEATHER_API_URL_OPTIONS = {
	method: 'GET'
};

async function getWeatherData(city) {
    //prep local url
    let url = WEATHER_API_URL;

    //convert city to something the api can read
    city = city.trim();
    city = city.replaceAll(' ', '-');
    city = city.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');

    url += `&q=${city}`;

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

//load data early (to prevent pop-in of the elements loading)
let apiPromise = getWeatherData("Everett");

document.addEventListener("DOMContentLoaded", function()
{
    //access DOM objects
    let tabContainer = document.querySelector("#day_tabs");

    let tempreture = document.querySelector('#temp');
    let tempretureUnit = document.querySelector('#temp_unit');
    
    let compass = document.querySelector('#wind_compass');

    let windSpeed = document.querySelector('#wind_speed');
    let speedUnit = document.querySelectorAll('.speed_unit');

    //use api promise system to fill in data required
    apiPromise.then(function(rawWeatherData)
    {
        //debugging for data
        console.log(rawWeatherData);

        //modify basic elements with current data
    }, function(error)
    {
        throw Error("failed to retrieve data from API: " + error);
    });

});


//define classes to be used
class Compass
{
    
}

class CurWindow
{

}

class DaySelector
{
    #mCompass
}